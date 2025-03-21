class TasksBase(BaseModel):
    title: str
    description: str
    status: str | None = None
    price: int
    created_at: datetime

class TasksCreate(TasksBase):
    pass

class TasksResponse(TasksBase):
    id: int 

    class Config:
        from_attributes = True
