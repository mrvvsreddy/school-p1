import asyncio
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
TABLE_NAME = "site_content"

async def test_fetch_granular():
    print(f"Testing granular fetch from '{TABLE_NAME}'...\n")
    
    # 1. Fetch ALL metadata (just to see row count, not data)
    # Using count='exact', head=True doesn't work well with python client sometimes,
    # so we select just the 'section' column which is lightweight.
    print("1. Checking table structure (fetching 'section' column only):")
    all_sections = supabase.table(TABLE_NAME).select("section").execute()
    print(f"   Found {len(all_sections.data)} distinct sections/rows:")
    for row in all_sections.data:
        print(f"   - {row['section']}")
    
    print("\n2. Simulating 'Performance Audit': Fetching ONLY 'hero' section:")
    # This is the key proof - we didn't fetch 'about', 'academics', etc.
    hero_data = supabase.table(TABLE_NAME).select("data").eq("section", "hero").execute()
    
    if hero_data.data:
        data_size = len(str(hero_data.data[0]['data']))
        print(f"   Success! Fetched 'hero' data.")
        print(f"   Payload size: ~{data_size} bytes")
        print("   (Other sections were NOT loaded, saving bandwidth/memory)")
    else:
        print("   Error: 'hero' section not found.")

if __name__ == "__main__":
    asyncio.run(test_fetch_granular())
