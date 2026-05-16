---
marp: true
theme: default
paginate: true
header: 'AI Engineering Syllabus'
footer: 'cs.kusandriadi.com'
---

# Data Science & AI for Business

**Transform data into decisions, translate business problems into AI solutions**

- Audience: Beginners with basic computer literacy
- No prior programming required
- Prerequisite for Machine Learning (Semester 2)

---

# Course Overview

- Businesses are swimming in data but struggling to make sense of it
- Learn to take messy, real-world data and turn it into clear answers
- Explore, clean, and visualize data using tools professionals actually use
- Explain findings to non-technical people (one of the most important skills)
- Know when AI is the right tool for a business problem (spoiler: it's not always)

---

# Prerequisites & Self-Check

**Prerequisites:**
- Basic computer literacy
- Willingness to learn Python (no prior programming required)

**No self-check needed** -- this is a true beginner-friendly course!

---

# Tools & Technologies

- **Languages:** Python, SQL
- **Data:** Pandas, NumPy
- **Visualization:** Matplotlib, Seaborn, Plotly, Power BI / Tableau
- **Applications:** Jupyter Notebooks, Streamlit
- **Workflow:** Git

---

# Week 1: The Data-Driven Organization

- What is data science? Where it sits between statistics, CS, and business
- The data science workflow: question, collect, clean, analyze, visualize, communicate, decide
- Types of analytics: descriptive, diagnostic, predictive, prescriptive
- Data roles: analyst vs scientist vs engineer vs ML engineer vs AI engineer
- AI-augmented analytics: GenAI copilots are changing how analysts work in 2026

**What You'll Build:**
- Set up Python environment with Jupyter Notebooks
- Explore a real-world dataset and formulate business questions

---

# Week 2: Python for Data Analysis

- Python fundamentals: variables, data types, loops, functions, list comprehensions
- NumPy: arrays, vectorized operations, mathematical functions
- Pandas basics: Series, DataFrame, reading data from CSV/Excel/JSON
- Data selection & filtering: loc, iloc, boolean indexing
- Aggregation: groupby, pivot tables, crosstabs

**What You'll Build:**
- Analyze a sales dataset: top products, seasonal trends, customer segments
- Build a reusable data loading and cleaning script

---

# Week 3: SQL for Data Science

- Why SQL matters: the universal language of data
- Core SQL: SELECT, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT
- Joins: INNER, LEFT, RIGHT, FULL -- connecting tables
- Subqueries and CTEs (Common Table Expressions)
- Window functions: ROW_NUMBER, RANK, LAG, LEAD, running totals

**What You'll Build:**
- Query a multi-table business database to answer real business questions
- Combine SQL and Python in a single analytics workflow

---

# Week 4: Exploratory Data Analysis (EDA)

- The art of EDA: let data tell its story before making assumptions
- Descriptive statistics: mean, median, mode, variance, standard deviation, IQR
- Distribution analysis: histograms, box plots, violin plots, skewness
- Correlation: Pearson, Spearman, spurious correlations (moving together does not mean causation)
- Handling messy data: missing values, duplicates, inconsistent formats

**What You'll Build:**
- Perform comprehensive EDA on a real-world dataset
- Create an EDA report with findings, hypotheses, and recommended next steps

---

# Week 5: Data Visualization & Storytelling

*A brilliant analysis is useless if nobody understands it.*

- Principles of effective visualization: clarity, simplicity, honesty
- Chart selection: bar, line, scatter, heatmap, treemap, funnel
- Matplotlib/Seaborn (static) and Plotly (interactive)
- Data storytelling: situation, complication, resolution
- Avoiding misleading visualizations: scale manipulation, cherry-picking

**What You'll Build:**
- Create an interactive dashboard for a business case study
- Present a data story with clear narrative and actionable recommendations

---

# Week 6: Statistics for Business Decisions

*Statistics is how you know whether something is actually true or just looks that way by accident.*

- Probability: events, conditional probability, Bayes' theorem
- Distributions: normal, binomial, Poisson
- Hypothesis testing: null vs alternative, p-values, significance levels
- A/B testing: how tech companies make data-driven product decisions
- Common mistakes: p-hacking, multiple comparisons, confusing significance with importance

**What You'll Build:**
- Design and analyze a simulated A/B test
- Make a business recommendation based on statistical evidence

---

# Week 7: Midterm Exam

- Covers Weeks 1-6
- Data science fundamentals
- Python and SQL
- Exploratory Data Analysis
- Data visualization
- Statistics for business decisions

---

# Week 8: Predictive Analytics & Forecasting

- Using historical data to predict future outcomes
- Time series analysis: trends, seasonality, cyclical patterns
- Simple forecasting: moving averages, exponential smoothing
- Linear regression as a business tool
- Real-time analytics: streaming data, event-driven analysis (Kafka overview)

**What You'll Build:**
- Build a sales forecasting model using time series techniques
- Create a churn risk scoring system for a subscription business

---

# Week 9: Data Engineering Essentials

*Bad data in means bad answers out.*

- Data sources: databases, APIs, web scraping, IoT, logs, files
- ETL vs ELT (Extract, Transform, Load): the data pipeline concept
- Data quality: detection, measurement, remediation
- Cloud storage: data lakes, warehouses, lakehouses (newer hybrid approach)
- Data governance: ownership, catalogs, lineage; privacy (GDPR, PII, anonymization)

**What You'll Build:**
- Build a simple ETL pipeline: extract from API, transform with Python, load into a database
- Document a data dictionary and data quality report

---

# Week 10: AI for Business -- When and How to Use AI

- Not every problem needs AI, and not every AI project succeeds
- The AI project lifecycle: ideation, feasibility, data assessment, build, deploy, measure, iterate
- Problem framing: translating business problems into data/AI problems
- Build vs buy vs fine-tune: decision framework
- The 95% failure rate: why most AI investments show zero return (MIT 2026)

**What You'll Build:**
- Evaluate 3 business scenarios and determine if AI is the right solution
- Write an AI project proposal with problem framing, success metrics, and ROI estimation

---

# Week 11: Communicating with Stakeholders

- The analytics translator role: bridging technical teams and executives
- Executive communication: presenting data findings to non-technical stakeholders
- Building compelling business cases with clear ROI
- Report writing: executive summary, methodology, findings, recommendations
- Handling objections: navigating data vs intuition conflicts

**What You'll Build:**
- Create an executive presentation for a data analysis project
- Practice presenting to a simulated C-suite audience with Q&A

---

# Week 12: Building Data Products with Streamlit

- What is a data product? Applications that serve data-driven insights to users
- Streamlit: turning Python scripts into interactive web applications
- Building dashboards: filters, charts, tables, user inputs
- Connecting to live data: APIs, databases, file uploads
- AI-powered data products: chat interfaces for text-to-SQL

**What You'll Build:**
- Build a complete data product with Streamlit: interactive dashboard with filters, charts, and insights
- Deploy and share it with classmates for feedback

---

# Week 13: AI Ethics & Data Responsibility

- Where bias comes from: sampling, historical, measurement, representation
- Fairness in data products: who is helped, who is harmed?
- Privacy by design: building products that protect user privacy from the start
- Regulatory landscape: GDPR, CCPA, Indonesia's PDP Law
- AI in high-stakes domains: hiring, lending, healthcare

**What You'll Build:**
- Audit a dataset for potential biases and document findings
- Write a data ethics assessment for an AI project proposal

---

# Week 14: Capstone Demo

- Students present a complete data science project to the class
- **Requirements:**
  - Business question, data collection, EDA
  - Analysis, visualization, insights
  - Business recommendation
- Bonus: deploy as a Streamlit data product
- Peer review and instructor feedback

---

# Week 15: Review & Catch-up

- Buffer week for topics that need reinforcement
- Options include:
  - Industry guest lecture
  - Portfolio review
  - Career preparation

---

# Week 16: Final Exam

- Comprehensive exam covering all course material:
  - Data analysis and SQL
  - Statistics and visualization
  - Predictive analytics and data engineering
  - AI for business and ethics
  - Communication and data products

---

# Recommended Resources

- **Python for Data Analysis** -- Wes McKinney
- **Storytelling with Data** -- Cole Nussbaumer Knaflic
- **Naked Statistics** -- Charles Wheelan
- **Data Science for Business** -- Foster Provost & Tom Fawcett
- **The Art of Statistics** -- David Spiegelhalter
