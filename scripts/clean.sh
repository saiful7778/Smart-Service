#!/bin/bash

# Safe version with dry-run option
DRY_RUN=false
TARGETS=()   # Array of folders to search for

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        *)
            # Add folder name to array
            TARGETS+=("$1")
            shift
            ;;
    esac
done

# Default to dist if no targets provided
if [ ${#TARGETS[@]} -eq 0 ]; then
    TARGETS=("dist")
fi

echo "Searching for folders: ${TARGETS[*]}"

# Build find expression dynamically
FIND_EXPR=()
for folder in "${TARGETS[@]}"; do
    FIND_EXPR+=( -name "$folder" -type d -o )
done
unset 'FIND_EXPR[${#FIND_EXPR[@]}-1]'  # Remove last -o

# DRY RUN MODE
if [ "$DRY_RUN" = true ]; then
    echo "DRY RUN MODE - No files will be deleted"
    echo "Found folders:"
    find . \( "${FIND_EXPR[@]}" \)
    count=$(find . \( "${FIND_EXPR[@]}" \) | wc -l)
    echo "Total: $count folders"
    exit 0
fi

# Actual deletion mode
count=$(find . \( "${FIND_EXPR[@]}" \) | wc -l)

if [ $count -eq 0 ]; then
    echo "No matching folders found."
    exit 0
fi

echo "Found $count folder(s)."
read -p "Are you sure you want to delete them? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Deleting folders..."
    find . \( "${FIND_EXPR[@]}" \) -exec rm -rf {} +
    echo "Done! All matching folders have been deleted."
else
    echo "Operation cancelled."
fi
