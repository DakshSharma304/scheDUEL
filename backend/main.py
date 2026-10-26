from fastapi import FastAPI
from models import ScheduleRequest, Teacher, Course, Student
from solver import generate_schedule

app = FastAPI()

@app.post("/generate")
def generate(data: dict):
    courses = [Course.model_validate(c) for c in data["courses"]]
    course_lookup = {course.name: course for course in courses}
    students = []
    for student in data["students"]:
        students.append(Student(id=student["id"], required_courses=[course_lookup[name] for name in student["required_courses"]], electives=[course_lookup[name] for name in student["electives"]]))

    request = ScheduleRequest(teachers=[Teacher.model_validate(t) for t in data["teachers"]], courses=courses, students=students, periods=data["periods"], max_time=data.get("max_time", 60))

    return generate_schedule(request)