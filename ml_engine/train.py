import pandas as pd
import numpy as np
import joblib
import json
import os
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.metrics import r2_score, mean_absolute_error

def train_model():
    # Load data
    data_path = os.path.join(os.getcwd(), 'data', 'Cleaned_Car_data.csv')
    df = pd.read_csv(data_path)
    
    # Remove the unnamed index column if it exists
    if 'Unnamed: 0' in df.columns:
        df = df.drop(columns=['Unnamed: 0'])
    elif '' in df.columns:
         df = df.drop(columns=[''])

    print("Data Columns:", df.columns.tolist())
    
    # Features and Target
    X = df.drop(columns=['Price'])
    y = df['Price']
    
    # Splitting the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Preprocessing
    # Features: name, company, year, kms_driven, fuel_type
    categorical_features = ['name', 'company', 'fuel_type']
    numeric_features = ['year', 'kms_driven']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features),
            ('num', StandardScaler(), numeric_features)
        ]
    )
    
    # Pipeline
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', LinearRegression())
    ])
    
    # Define hyperparameter search space
    param_grid = [
        {
            'regressor': [LinearRegression()],
        },
        {
            'regressor': [Ridge()],
            'regressor__alpha': [0.1, 1.0, 10.0]
        },
        {
            'regressor': [Lasso()],
            'regressor__alpha': [0.1, 1.0, 10.0]
        }
    ]
    
    print("Starting GridSearchCV for model selection and fine-tuning...")
    grid_search = GridSearchCV(pipeline, param_grid, cv=5, scoring='r2', n_jobs=-1)
    grid_search.fit(X_train, y_train)
    
    best_model = grid_search.best_estimator_
    print(f"Best parameters: {grid_search.best_params_}")
    
    # Evaluate
    y_pred = best_model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    
    print(f"R2 Score: {r2:.4f}")
    print(f"Mean Absolute Error: {mae:.2f}")
    
    # Save model
    model_path = os.path.join(os.getcwd(), 'ml_engine', 'car_price_pipeline.pkl')
    joblib.dump(best_model, model_path)
    print(f"Model saved to {model_path}")
    
    # Generate metadata for frontend
    metadata = {
        'companies': sorted(df['company'].unique().tolist()),
        'years': sorted(df['year'].unique().tolist(), reverse=True),
        'fuel_types': sorted(df['fuel_type'].unique().tolist()),
        'models_by_company': {
            company: sorted(df[df['company'] == company]['name'].unique().tolist())
            for company in df['company'].unique()
        },
        'metrics': {
            'r2_score': r2,
            'mae': mae
        }
    }
    
    metadata_path = os.path.join(os.getcwd(), 'ml_engine', 'metadata.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=4)
    print(f"Metadata saved to {metadata_path}")

if __name__ == "__main__":
    train_model()
