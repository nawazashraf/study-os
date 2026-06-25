type AttendanceInfo = {
  title: string;
  message: string;
  color: string;
};

export const getAttendanceInfo = (percentage: number): AttendanceInfo => {
  if (percentage >= 95) {
    return {
      title: "Outstanding",
      message: "Excellent consistency. Keep it up!",
      color: "#22C55E", // Green-500
    };
  }

  if (percentage >= 90) {
    return {
      title: "Excellent",
      message: "You're doing great.",
      color: "#4ADE80", // Green-400
    };
  }

  if (percentage >= 85) {
    return {
      title: "Very Good",
      message: "Comfortably above the requirement.",
      color: "#84CC16", // Lime-500
    };
  }

  if (percentage >= 80) {
    return {
      title: "Good",
      message: "Keep attending regularly.",
      color: "#EAB308", // Yellow-500
    };
  }

  if (percentage >= 75) {
    return {
      title: "Safe",
      message: "You're just above the minimum.",
      color: "#F59E0B", // Amber-500
    };
  }

  if (percentage >= 70) {
    return {
      title: "Warning",
      message: "One or two absences can put you below 75%.",
      color: "#F97316", // Orange-500
    };
  }

  if (percentage >= 60) {
    return {
      title: "Critical",
      message: "Attend every upcoming class.",
      color: "#EF4444", // Red-500
    };
  }

  return {
    title: "Danger",
    message: "Attendance is below the required level.",
    color: "#B91C1C", // Red-700
  };
};
