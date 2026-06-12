#bakend/services/graph_services.py 

import io
import numpy as np
import matplotlib
# Force a headless backend to prevent GUI thread crashes on the server
matplotlib.use('Agg')
import matplotlib.pyplot as plt

def generate_subject_comparison_chart(
    student_name: str, 
    student_class: str, 
    roll: int, 
    year: int, 
    exam_records
) -> io.BytesIO:
    """
    Generates a grouped bar chart where SUBJECTS are on the X-axis,
    and terms are compared side-by-side for each subject.
    """
    
    # 1. These WILL be the categories on your X-Axis
    subjects = ["english", "nepali", "mathematics", "science", "social"]
    display_subjects = [sub.capitalize() for sub in subjects]
    
    num_subjects = len(subjects)
    num_terms = len(exam_records)
    
    # 2. X-axis base coordinates lock onto the number of SUBJECTS (0 to 4)
    x_indexes = np.arange(num_subjects)  
    
    # Width of individual term bars inside each subject cluster
    bar_width = 0.25                  
    
    # Math positioning to center the term clusters directly over the subject text
    start_offset = x_indexes - ((num_terms - 1) * bar_width) / 2

    # 3. Initialize canvas
    fig, ax = plt.subplots(figsize=(10, 6), dpi=150)
    
    # Colors represent the Terms: Term 1 (Deep Blue), Term 2 (Light Blue), Term 3 (Red)
    term_colors = ['#1d3557', '#457b9d', '#e63946'] 

    # 4. LOOP TERM BY TERM (This shifts the logic to what you want)
    for idx, record in enumerate(exam_records):
        # Extract the marks for all 5 subjects for this specific term
        term_scores = [float(getattr(record, sub, 0)) for sub in subjects]
        
        # Shift this term's bars horizontally to sit side-by-side
        current_x = start_offset + (idx * bar_width)
        
        bars = ax.bar(
            current_x, 
            term_scores, 
            width=bar_width, 
            label=str(record.term).strip().capitalize(), # 'First', 'Second' goes to Legend
            color=term_colors[idx % len(term_colors)],
            edgecolor='white',
            linewidth=0.6
        )
        
        # Annotate the exact scores on top of each bar
        for bar in bars:
            height = bar.get_height()
            ax.annotate(
                f'{int(height)}',
                xy=(bar.get_x() + bar.get_width() / 2, height),
                xytext=(0, 4),  
                textcoords="offset points",
                ha='center', va='bottom', 
                fontsize=8, weight='bold'
            )

    # 5. Labels and Titles (Flipped to match your goal)
    ax.set_ylabel('Marks Obtained (%)', fontsize=11, weight='bold', labelpad=10)
    ax.set_xlabel('Academic Subjects', fontsize=11, weight='bold', labelpad=10)
    
    student_id = getattr(exam_records[0], 'student_id', 'N/A')
    ax.set_title(
        f"Term-Wise Subject Performance Analysis\n"
        f"ID: {student_id} — {student_name}  |  Class: {student_class}  |  Roll: {roll}  |  Year: {year}",
        fontsize=12, weight='bold', pad=15
    )
    
    # Force the X-axis labels to show the SUBJECT names instead of terms
    ax.set_xticks(x_indexes)
    ax.set_xticklabels(display_subjects, fontsize=10, weight='semibold')
    
    # Layout adjustments
    ax.set_ylim(0, 112)
    ax.grid(axis='y', linestyle=':', alpha=0.6, color='#b0b0b0')
    ax.set_axisbelow(True)

    # Legend now tracks the Assessment Intervals (Terms)
    ax.legend(title="Assessment Intervals", loc='upper left', bbox_to_anchor=(1.02, 1))
    
    plt.tight_layout()

    # 6. Stream and close context
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png', bbox_inches='tight')
    img_buffer.seek(0)
    plt.close(fig)
    
    return img_buffer