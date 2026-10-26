from ortools.sat.python import cp_model
from models import ScheduleRequest

def generate_schedule(schedule_request: ScheduleRequest):
    model = cp_model.CpModel()
    runs = {}
    assign_teacher = {}
    assign_period = {}
    active = {}
    enrolled = {}
    student_period = {}
    fallback_hall = {}
    elective_rewards = []
    size_penalties = []

    #icl this is not a good solution but i forgot to incorporate semesters and dont have time to rewrite everything
    teacher_busy = {}
    student_busy = {}

    qualified = teacher_quals(schedule_request)
    for course in schedule_request.courses:
        for i in range(course.max_classes):
            runs[(course.name, i)] = model.new_bool_var(f"runs_{course.name}_{i}")
            for semester in range(1, 3):
                active[(course.name, i, semester)] = model.new_bool_var(f"{course.name}_{i}_{semester}")
            if course.length == 2:
                model.add(active[course.name, i, 1] + active[course.name, i, 2] == 2 * runs[course.name, i])
            else:
                model.add(active[course.name, i, 1] + active[course.name, i, 2] == runs[course.name, i])
            for teacher in qualified[course.name]:
                assign_teacher[(course.name, i, teacher.id)] = model.new_bool_var(f"{teacher.id}_{course.name}_{i}")
                for period in teacher.periods_available:
                    assign_period[(course.name, i, teacher.id, period)] = model.new_bool_var(f"{course.name}_{i}_{teacher.id}_{period}")
                model.add(sum(assign_period[course.name, i, teacher.id, period] for period in teacher.periods_available) == assign_teacher[course.name, i, teacher.id])
            model.add(sum(assign_teacher[(course.name, i, teacher.id)] for teacher in qualified[(course.name)]) == runs[(course.name, i)])

    for (course_name, i, teacher_id, period), p in assign_period.items():
        for semester in range(1,3):
            teacher_busy[(course_name, i, teacher_id, period, semester)] = model.new_bool_var(f"{course_name}_{i}_{teacher_id}_{period}_{semester}")
            model.add(teacher_busy[(course_name, i, teacher_id, period, semester)] <= assign_period[(course_name, i, teacher_id, period)])
            model.add(teacher_busy[(course_name, i, teacher_id, period, semester)] <= active[course_name, i, semester])
            model.add(teacher_busy[(course_name, i, teacher_id, period, semester)] >= assign_period[(course_name, i, teacher_id, period)] + active[course_name, i, semester] - 1)

    for teacher in schedule_request.teachers:
        for semester in range(1, 3):
            model.add(teacher.max_teach >= sum(variable for (course_name, i, teacher_id, period, s), variable in teacher_busy.items() if teacher.id == teacher_id and s == semester))
            for p in teacher.periods_available:
                model.add(1 >= sum(variable for (course_name, i, teacher_id, period, s), variable in teacher_busy.items() if teacher.id == teacher_id and period == p and s == semester))

    for student in schedule_request.students:
        requested = student.required_courses + student.electives
        for course in requested:
            for i in range(0, course.max_classes):
                enrolled[(student.id, course.name, i)] = model.new_bool_var(f"{student.id}_{course.name}_{i}")
                model.add(enrolled[(student.id, course.name, i)] <= runs[(course.name, i)])
            if course in student.required_courses:    
                model.add(sum(enrolled[(student.id, course.name, i)] for i in range(0, course.max_classes)) == 1)
            else:
                model.add(sum(enrolled[(student.id, course.name, i)] for i in range(0, course.max_classes)) <= 1)

    for course in schedule_request.courses:
        for i in range(0, course.max_classes):
            model.add(course.min_size * runs[(course.name, i)] <= sum(variable for (student_id, course_name, idx), variable in enrolled.items() if course_name == course.name and idx == i))
            model.add(sum(variable for (student_id, course_name, idx), variable in enrolled.items() if course_name == course.name and idx == i) <= course.max_size * runs[(course.name, i)])
            count = sum(v for (sid, name, idx), v in enrolled.items() if name == course.name and idx == i)

            deviation = model.new_int_var(0, course.max_size, f"dev_{course.name}_{i}")
            model.add_abs_equality(deviation, count - course.pref_size * runs[course.name, i])
            size_penalties.append(deviation)

    for (course_name, i, teacher_id, period) in assign_period:
        for student in schedule_request.students:
            if (student.id, course_name, i) in enrolled:
                student_period[(student.id, course_name, i, teacher_id, period)] = model.new_bool_var(f"{student.id}_{course_name}_{i}_{teacher_id}_{period}")

    for (student_id, course_name, i, teacher_id, period), x in student_period.items():
        e = enrolled[(student_id, course_name, i)]
        p = assign_period[(course_name, i, teacher_id, period)]
        model.add(x <= e)
        model.add(x <= p)
        model.add(x >= e + p - 1)

    for (student_id, course_name, i, teacher_id, period), p in student_period.items():
        for semester in range(1,3):
            student_busy[(student_id, course_name, i, teacher_id, period, semester)] = model.new_bool_var(f"{student_id}_{course_name}_{i}_{teacher_id}_{period}_{semester}")
            b = student_busy[(student_id, course_name, i, teacher_id, period, semester)]
            a = active[(course_name, i, semester)]
            model.add(b <= p)
            model.add(b <= a)
            model.add(b >= p + a - 1)

    for student in schedule_request.students:
        for period in range(1, schedule_request.periods + 1):
            for semester in range(1, 3):
                fallback_hall[(student.id, period, semester)] = model.new_bool_var(f"fallback_{student.id}_{period}_{semester}")
                model.add(sum(j for (student_id, course_name, i, teacher_id, p, s), j in student_busy.items() if student_id == student.id and p == period and s == semester) + fallback_hall[(student.id, period, semester)] == 1)

    for student in schedule_request.students:
        for rank, course in enumerate(student.electives):
            reward = max(10, 110 - 10 * rank)
            for i in range(course.max_classes):
                elective_rewards.append(reward * course.length * enrolled[(student.id, course.name, i)])

    model.maximize(3 * sum(elective_rewards) - sum(size_penalties))
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = schedule_request.max_time
    status = solver.solve(model)

    #work from here for the api ver

    if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        return {
            "status": solver.status_name(status),
            "issues": ["41"]
        }

    for (student_id, course_name, i, teacher_id, period, semester), variable in student_busy.items():
        if solver.value(variable):
            print(student_id, course_name, period, semester)

    for (student_id,  period, semester), variable in fallback_hall.items():
        if solver.value(variable):
            print(student_id, " Fallback Study Hall ", period, semester)

def teacher_quals(schedule_request: ScheduleRequest):
    qualified = {}
    for course in schedule_request.courses:
        qualified[course.name] = []
        for teacher in schedule_request.teachers:
            if course.name in teacher.courses_teaching:
                qualified[course.name].append(teacher)
    return qualified