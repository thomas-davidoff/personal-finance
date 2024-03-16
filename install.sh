#!/bin/bash

# Define your backend directory
BACKEND_DIR="backend"

# Define your virtual environment directory name
VENV_DIR="$BACKEND_DIR/venv"

# Check if the virtual environment directory exists
if [ ! -d "$VENV_DIR" ]; then
    # The virtual environment does not exist, create it
    echo "Creating virtual environment in $VENV_DIR..."
    mkdir -p $BACKEND_DIR  # Create the backend directory if it doesn't exist
    python3 -m venv $VENV_DIR
else
    # The virtual environment already exists
    echo "Virtual environment already exists in $VENV_DIR."
fi

# Activate the virtual environment
echo "Activating virtual environment..."
source $VENV_DIR/bin/activate

# Install requirements from requirements.txt
echo "Installing requirements..."
pip install -r $BACKEND_DIR/requirements.txt

echo "Setup complete."
