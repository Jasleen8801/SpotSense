from fastapi import FastAPI
import ai_roasts

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/roast")
def generate_roast(user_data: dict):
    # Call your ai_functions module to generate roasts based on user data
    roast = ai_functions.generate_roast(user_data)
    return {"roast": roast}
