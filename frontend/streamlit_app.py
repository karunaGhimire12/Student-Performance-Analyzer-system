# import streamlit as st
# import pandas as pd
# import requests

# st.title("Student Table")

# # Create session data
# if "df" not in st.session_state:
#     st.session_state.df = pd.DataFrame(columns=["id", "name", "math"])

# # Buttons
# if st.button("Add row"):
#     st.session_state.df.loc[len(st.session_state.df)] = ["", "", ""]

# if st.button("Clear"):
#     st.session_state.df = pd.DataFrame(columns=["id", "name", "math"])

# # Editable table
# st.session_state.df = st.data_editor(st.session_state.df)

# # Save
# if st.button("Save"):
#     requests.post(
#         "http://localhost:8000/students",
#         json=st.session_state.df.fillna("").to_dict("records")
#     )
#     st.success("Saved!")

# # Download
# st.download_button(
#     "Download CSV",
#     st.session_state.df.to_csv(index=False),
#     "students.csv"
# )