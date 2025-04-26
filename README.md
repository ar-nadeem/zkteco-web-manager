# ZKTeco Web Manager

A full-stack web application for managing ZKTeco devices with a FastAPI backend and React frontend.

## Features

- Web-based management interface for ZKTeco devices :white_check_mark:
- FastAPI backend for efficient API handling :white_check_mark:
- React frontend for modern and responsive UI :white_check_mark:
- Device management capabilities :white_check_mark:
- Data synchronization with ZKTeco devices :white_check_mark:
- More coming soon

## Prerequisites

- Python 3.7+
- Node.js and npm/yarn
- ZKTeco device(s) on the network

## Installation

### Backend Setup

1. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd app
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Configuration

1. Create a `.env` file in the root directory with your configuration:
   ```
   DEVICE_IP=your_device_ip
   DEVICE_PORT=your_device_port
   ```

## Running the Application

### Backend

1. Activate the virtual environment if not already activated
2. Run the FastAPI server:
   ```bash
   fastapi run
   ```
   The API will be available at `http://localhost:8000`

### Frontend

1. In a separate terminal, navigate to the frontend directory
2. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The frontend will be available at `http://localhost:3000`

## API Documentation

Once the backend is running, you can access:

- Interactive API documentation at `http://localhost:8000/docs`
- Alternative API documentation at `http://localhost:8000/redoc`

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## Support

For support, please open an issue in the GitHub repository.
