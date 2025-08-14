#!/bin/bash
cd /home/kavia/workspace/code-generation/health-tracker-pro-159096/calorie_workout_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

