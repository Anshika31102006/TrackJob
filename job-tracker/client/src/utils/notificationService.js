export const syncNotifications = (jobs) => {
  let notifications = [];
  try {
    notifications = JSON.parse(localStorage.getItem("notifications")) || [];
  } catch {
    notifications = [];
  }

  // Ensure notifications is an array
  if (!Array.isArray(notifications)) {
    notifications = [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const updatedNotifications = [...notifications];
  let changed = false;

  jobs.forEach((job) => {
    if (!job.deadline) return;

    const deadlineDate = new Date(job.deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const reminderDays = parseInt(job.reminderDays || "5", 10);

    // If deadline is within the reminder threshold
    if (diffDays >= 0 && diffDays <= reminderDays) {
      const notificationId = `deadline-${job._id}-${diffDays}`;
      
      // Check if this specific reminder already exists
      const exists = updatedNotifications.some((n) => n._id === notificationId);
      
      if (!exists) {
        let message = `Deadline is in ${diffDays} days (${new Date(job.deadline).toLocaleDateString()})`;
        if (diffDays === 0) message = "Deadline is TODAY! 🚨";
        else if (diffDays === 1) message = "Deadline is TOMORROW! ⚠️";

        updatedNotifications.push({
          _id: notificationId,
          title: `${job.company} - ${job.role}`,
          message,
          read: false,
          priority: diffDays <= 1 ? "High" : "Medium",
          deadline: job.deadline,
        });
        changed = true;
      }
    }
  });

  if (changed) {
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  }
};
