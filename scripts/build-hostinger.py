#!/usr/bin/env python3
"""
ShivAmrit Healers — Hostinger One-Click Deployment Packager
Builds the production Vite bundle and packages dist/ into hostinger-deploy.zip
ready for instant upload to Hostinger File Manager (public_html).
"""

import os
import subprocess
import sys
import zipfile

def main():
    print("🚀 [1/3] Building production bundle for Hostinger...")
    result = subprocess.run(["npm", "run", "build"], check=False)
    if result.returncode != 0:
        print("❌ Build failed! Please review error messages above.")
        sys.exit(1)

    dist_dir = "dist"
    output_zip = "hostinger-deploy.zip"

    if not os.path.exists(dist_dir):
        print(f"❌ Error: {dist_dir} directory not found.")
        sys.exit(1)

    print(f"📦 [2/3] Creating {output_zip} from {dist_dir}/ ...")
    file_count = 0
    with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(dist_dir):
            for file in files:
                filepath = os.path.join(root, file)
                # Store relative to dist_dir
                arcname = os.path.relpath(filepath, dist_dir)
                zipf.write(filepath, arcname)
                file_count += 1

    size_mb = os.path.getsize(output_zip) / (1024 * 1024)
    print(f"✨ [3/3] Done! Created {output_zip} ({size_mb:.2f} MB, {file_count} files)")
    print("\n================ HOSTINGER DEPLOYMENT INSTRUCTIONS ================")
    print("1. Log in to your Hostinger hPanel -> File Manager")
    print("2. Navigate to 'public_html'")
    print(f"3. Upload '{output_zip}'")
    print(f"4. Right-click '{output_zip}' -> Extract -> select current directory")
    print("5. Your ShivAmrit Healers website is live immediately with full SPA routing!")
    print("===================================================================\n")

if __name__ == "__main__":
    main()
