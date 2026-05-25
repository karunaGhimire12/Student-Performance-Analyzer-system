# # ==========================================
# # IMPORT LIBRARIES
# # ==========================================

# import streamlit as st
# import pandas as pd
# import requests

# from st_aggrid import AgGrid, GridOptionsBuilder


# # ==========================================
# # PAGE TITLE
# # ==========================================

# st.title("Student Performance Analyzer")


# # ==========================================
# # DEFAULT TABLE DATA
# # ==========================================

# if "df" not in st.session_state:

#     st.session_state.df = pd.DataFrame({

#         "student_name": [""] * 10,

#         "term": [""] * 10,

#         "year": [""] * 10,

#         "english": [0] * 10,

#         "nepali": [0] * 10,

#         "mathematics": [0] * 10,

#         "science": [0] * 10,

#         "social": [0] * 10,

#         "attendance": [0] * 10
#     })


# # ==========================================
# # BUTTON SECTION
# # ==========================================

# col1, col2 = st.columns(2)


# # ==========================================
# # ADD NEW ROW
# # ==========================================

# with col1:

#     if st.button("Add New Row", width="stretch"):

#         new_row = {

#             "student_name": "",

#             "term": "",

#             "year": "",

#             "english": 0,

#             "nepali": 0,

#             "mathematics": 0,

#             "science": 0,

#             "social": 0,

#             "attendance": 0
#         }

#         st.session_state.df = pd.concat(

#             [
#                 st.session_state.df,
#                 pd.DataFrame([new_row])
#             ],

#             ignore_index=True
#         )


# # ==========================================
# # DELETE LAST ROW
# # ==========================================

# with col2:

#     if st.button("Delete Last Row", width="stretch"):

#         if len(st.session_state.df) > 0:

#             st.session_state.df = st.session_state.df.iloc[:-1]


# # ==========================================
# # AG GRID CONFIGURATION
# # ==========================================

# gb = GridOptionsBuilder.from_dataframe(st.session_state.df)

# # Make all columns editable
# gb.configure_default_column(editable=True)

# # Build options
# grid_options = gb.build()


# # ==========================================
# # DISPLAY AG GRID
# # ==========================================

# grid_response = AgGrid(

#     st.session_state.df,

#     gridOptions=grid_options,

#     height=400,

#     fit_columns_on_grid_load=True,

#     allow_unsafe_jscode=True
# )


# # ==========================================
# # GET UPDATED DATA
# # ==========================================

# updated_df = pd.DataFrame(grid_response["data"])


# # ==========================================
# # SAVE BUTTON
# # ==========================================

# if st.button("Save Results", width="stretch"):

#     try:

#         # Convert dataframe to JSON
#         data = updated_df.fillna(0).to_dict("records")

#         # Send data to FastAPI backend
#         response = requests.post(

#             "http://127.0.0.1:8000/students",

#             json=data
#         )

#         # SUCCESS
#         if response.status_code == 200:

#             st.success("Student results saved successfully!")

#         # ERROR
#         else:

#             st.error(f"Failed: {response.status_code}")

#             st.write(response.text)

#     except Exception as e:

#         st.error(f"Error: {e}")


# # ==========================================
# # DOWNLOAD CSV
# # ==========================================

# st.download_button(

#     label="Download CSV",

#     data=updated_df.to_csv(index=False),

#     file_name="student_results.csv",

#     mime="text/csv",

#     width="stretch"
# )


import streamlit as st
import pandas as pd
import requests
from st_aggrid import AgGrid, GridOptionsBuilder
# import plotly.express as px # Un-comment this when you add charts later!

st.set_page_config(layout="wide")
st.title("📈 Academic Performance Analyzer & Tracker")

# =========================================================================
# CREATE THE INTERACTIVE TABS AT THE TOP
# =========================================================================
tab1, tab2 = st.tabs(["📋 Bulk Data Entry", "📊 Comparative Analytics Engine"])

# =========================================================================
# TAB 1: THE DATA ENTRY PORTAL (Your spreadsheet goes here)
# =========================================================================
with tab1:
    st.subheader("Excel-Style Marks Entry Spreadsheet")
    
    # Initialize your 10 empty rows in session state if not already there
    if "df" not in st.session_state:
        st.session_state.df = pd.DataFrame({
            "roll": [i for i in range(1, 11)],
            "name": [""] * 10,
            "student_class": ["10"] * 10,
            "term": ["First Term"] * 10,
            "year": [2026] * 10,
            "english": [0] * 10,
            "nepali": [0] * 10,
            "mathematics": [0] * 10,
            "science": [0] * 10,
            "social": [0] * 10,
            "attendance": [0] * 10
        })

    # Configure AG Grid column options
    gb = GridOptionsBuilder.from_dataframe(st.session_state.df)
    gb.configure_default_column(editable=True, resizable=True)
    gb.configure_column("roll", header_name="Roll No", width=90)
    gb.configure_column("name", header_name="Student Name", width=180)
    grid_options = gb.build()

    # Display the grid
    grid_response = AgGrid(
        st.session_state.df,
        gridOptions=grid_options,
        height=330,
        theme="alpine"
    )
    
    updated_df = pd.DataFrame(grid_response["data"])

    # Save button logic
    if st.button("🚀 Commit Spreadsheet to Database", type="primary"):
        raw_records = updated_df.to_dict("records")
        sanitized_payload = [row for row in raw_records if str(row.get("name")).strip()]
        
        if sanitized_payload:
            # Send data to your clean results router endpoint
            response = requests.post("http://127.0.0.1:8000/results/bulk", json=sanitized_payload)
            if response.status_code == 200:
                st.success(f"🎉 Successfully stored {len(sanitized_payload)} student records permanently!")
            else:
                st.error(f"Backend rejection: {response.text}")
        else:
            st.warning("No valid data found to save.")


# =========================================================================
# TAB 2: THE COMPARATIVE ANALYTICS ENGINE (Your charts will go here)
# =========================================================================
with tab2:
    st.subheader("Historical Student Progress Tracker")
    st.info("This section allows you to analyze a student's current scores against their past term performance.")
    
    # Dropdown to select a student from the database
    # For now, we will add a placeholder selector until you build the GET call
    student_id = st.number_input("Enter Student ID to view progress trend", min_value=1, value=1)
    
    if st.button("Analyze Progress"):
        # This is where your requests.get() will fetch data from your backend
        st.write(f"Fetching chronological history for Student ID: {student_id}...")
        # Then you pass that data into st.line_chart() here!