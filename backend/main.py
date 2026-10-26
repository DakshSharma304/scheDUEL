from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from models import ScheduleRequest, Teacher, Course, Student
from solver import generate_schedule

app = FastAPI()
app.add_middleware( # To allow all origins for CORS
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/generate")
def generate(data: dict):
    courses = [Course.model_validate(c) for c in data["courses"]]
    course_lookup = {course.name: course for course in courses}
    students = [
        Student(
            id=student["id"],
            required_courses=[
                course_lookup[name] for name in student["required_courses"]
            ],
            electives=[course_lookup[name] for name in student["electives"]],
        )
        for student in data["students"]
    ]

    request = ScheduleRequest(
        teachers=[Teacher.model_validate(teacher) for teacher in data["teachers"]],
        courses=courses,
        students=students,
        periods=data["periods"],
        max_time=data.get("max_time", 60),
    )

    return generate_schedule(request)


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=48217)