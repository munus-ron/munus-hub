import os
import psycopg2
from psycopg2 import sql

# Get database connection string from environment
database_url = os.environ.get('POSTGRES_URL')

if not database_url:
    print("Error: POSTGRES_URL environment variable not set")
    exit(1)

# Connect to the database
conn = psycopg2.connect(database_url)
conn.autocommit = True
cursor = conn.cursor()

print("Connected to database successfully")

# List of SQL scripts to run in order
scripts = [
    '001_create_users_and_profiles.sql',
    '002_create_projects.sql',
    '003_create_team.sql',
    '004_create_announcements.sql',
    '005_create_calendar.sql'
]

# Run each script
for script_name in scripts:
    script_path = f'scripts/{script_name}'
    print(f"\nRunning {script_name}...")
    
    try:
        with open(script_path, 'r') as f:
            sql_content = f.read()
            cursor.execute(sql_content)
            print(f"✓ {script_name} executed successfully")
    except Exception as e:
        print(f"✗ Error running {script_name}: {e}")
        conn.rollback()

# Verify tables were created
print("\n--- Verifying tables ---")
cursor.execute("""
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
""")

tables = cursor.fetchall()
print(f"\nCreated {len(tables)} tables:")
for table in tables:
    print(f"  - {table[0]}")

# Close connection
cursor.close()
conn.close()

print("\n✓ Database setup complete!")
