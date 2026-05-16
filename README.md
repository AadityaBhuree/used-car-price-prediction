# Car Price Predictor

This is a project that predicts the price of used cars using Machine Learning. It has three main parts:
1. **Machine Learning (ml_engine):** Cleans the car data and trains the model.
2. **Backend (backend):** A FastAPI server that runs the model and gives predictions.
3. **Frontend (frontend):** A React website where users can choose a car and see the price.

---

## How to Run the Project

### 1. Start the Backend API
First, open your terminal and start the backend so the website has data to talk to.

```bash
# Go to the backend folder
cd backend

# Install the required Python packages
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```
*Note: The API will run at http://localhost:8000*

### 2. Start the Frontend Website
Open a second terminal window to start the website.

```bash
# Go to the frontend folder
cd frontend

# Install the Node packages
npm install

# Start the website
npm run dev
```
*Note: Open the link it gives you (usually http://localhost:5173) in your browser.*

---

## (Optional) Retrain the Model
If you change the data or want to retrain the AI model:
```bash
cd ml_engine
python train.py
```

## Docker
If you have Docker installed, you can run everything with one command:
```bash
docker-compose up
```
