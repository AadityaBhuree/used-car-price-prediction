import pandas as pd
import os

def clean_data():
    # Define paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'data', 'Cleaned_Car_data.csv')
    
    print(f"Reading data from: {data_path}")
    df = pd.read_csv(data_path)
    
    # Function to remove company name from model name
    def remove_company_from_name(row):
        company = row['company']
        name = row['name']
        
        # Check if name starts with company (case insensitive)
        if name.lower().startswith(company.lower()):
            # Remove company name and extra spaces
            new_name = name[len(company):].strip()
            return new_name
        return name

    # Apply transformation
    print("Removing company names from model names...")
    original_names = df['name'].head().tolist()
    df['name'] = df.apply(remove_company_from_name, axis=1)
    new_names = df['name'].head().tolist()
    
    print(f"Sample before: {original_names}")
    print(f"Sample after:  {new_names}")
    
    # Save updated CSV
    df.to_csv(data_path, index=False)
    print(f"Updated data saved to: {data_path}")

if __name__ == "__main__":
    clean_data()
