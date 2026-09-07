import pandas as pd
from data_pipeline.clean import clean_data

def profile_data(filepath='WA_Fn-UseC_-Telco-Customer-Churn.csv'):
    df = clean_data(filepath)
    print("--- DATA PROFILE SUMMARY ---")
    print(df.info())
    print(df.describe())
    return df

if __name__ == "__main__":
    profile_data()