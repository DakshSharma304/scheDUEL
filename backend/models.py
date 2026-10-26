from pydantic import BaseModel

class Teacher(BaseModel):
    id: str
    courses_teaching: list[str]
    periods_available: list[int]
    max_teach: int

class Course(BaseModel):
    name: str
    length: int
    min_size: int
    max_size: int
    pref_size: int
    max_classes: int

class Student(BaseModel):
    id: str
    required_courses: list[Course]
    electives: list[Course]

class ScheduleRequest(BaseModel):
    teachers: list[Teacher]
    courses: list[Course]
    students: list[Student]
    periods: int
    max_time: int