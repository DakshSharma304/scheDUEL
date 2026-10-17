## Assumptions
- 2 semester scheduling year
- unify health/pe/drivers ed(since same period and stuff)

## What you gimme:

### Teachers

Teachers can teach x periods. Some teachers may not teach morning/afternoon classes. Teachers cannot teach two classes at the same time.

You provide a json(CONVERTED FROM CSV THEY INPUT) of all teachers, with whatever courses they are qualified to teach(and want to teach/are teaching this year), their availability, how many courses max they can teach.

Note that periods available matters because some teachers may teach at multiple places. The amount of courses they are willing to teach also matters, as nobody wants to teach EVERY SINGLE BLOCK. This may affect whether classes are running, and will always prioritize mandatory class fillings. If it becomes impossible, it is up to the user whether more should be scheduled or someone else should teach it additionally.

```json
{
    "id": "id_num",
    "courses-teaching": ["course1", "course2"],
    "periods-available": ["p1", "p2", "p3", "p4", "p5", "p7"],
    "max-teach": 5
}
```

### Students

Students take classes all the time(study hall counts as a class). Students can only take 1 class at a time. Students have mandatory and elective classes. Students can drop/change classes, which should not affect others. 

You provide a json(CONVERTED FROM CSV THEY INPUT) of all students, with all their mandatory courses and elective courses labeled as such, and the electives with priority listed.

Note that you can add as many required courses and electives as desired. Order matters for electives; it prioritizes the first as priority 1, second as priority 2, etc. For required courses, order does not matter, and the scheduler ensures they are met. Required courses would be like Precalculus or English; electives would be like AP CSA or AP Seminar. Ensure course names here match those in the teacher and courses files. Also, the frontend can associate names with the id numbers, but the backend won't because people could have same name!

```json
{
    "id": "id_num(e.g. mine's 47661)",
    "required_courses": ["course1", "course2"],
    "electives": ["elective1", "elective2"]
}
```

And specifically for course changes(e.g. dropping a class), which should only affect the student changing's schedule.

```json
{
    "id": "id_num(e.g. mine's 47661)",
    "course-remove": "course1",
    "course-replace": "course2"
}
```

### Courses

What courses are available. How many people(min/max/optimal_range) they can have. How many periods(min/max) there can be of that course.

You provide a json(CONVERTED FROM CSV THEY INPUT) of all courses and all information listed above.

Note that duration is in semesters for full-year and semester courses. Minimum and maximum class sizes are used to determine how many classes are needed, and whether the course should even run(ex. a course with 5 people probably shouldn't run). Preferred size is the size it should aim for; closeness to this value for all classes is best scoring. For example, a course with 32 people wanting to take it and preferred size of 16 would do 2 classes of 16 rather than 1 20 and 1 12, which an algorithm without a preferred size could choose. Maximum classes is useful where if 41 people want a class but the teacher can't teach 3, one person is necessarily left out if it is an elective, otherwise the user decides what to do.

```json
{
    "name": "course_name",
    "duration": 2,
    "min_class": 10,
    "max_class": 20,
    "pref-size": 16,
    "maximum-classes": 2
}
```

## What I give you

- teacher schedule
- student schedule
- any impossibilities(e.g. class not running bc not enough ppl) and have the human resolve them(e.g. ask person to choose another class they'd prefer)

```json
{
    "teachers-schedules": {
        "teacher_id1": {
            "semester1": ["period1", "period2"],
            "semester2": ["period1", "period2"]
        }
    },

    "students-schedules": {
        "student_id1": {
            "semester1": ["period1", "period2"],
            "semester2": ["period1", "period2"]
        }
    },

    "issues": ["make some error codes!"]
}
```

im not making error codes list, do that much at least