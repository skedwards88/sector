#!/bin/bash

# Directories that include images to compress
declare -a dirs=("src/images/rules")

# Loop over the directories
for dir in "${dirs[@]}"; do
  # Loop over the files in the directory
  for file in $dir/*; do
    # Get the file extension
    extension="${file##*.}"
    # Compress the file if it is a png
    if [ "$extension" = "png" ]; then
      cwebp -q 75 $file -o ${dir}/$(basename $file '.png').webp
    fi
  done
done
