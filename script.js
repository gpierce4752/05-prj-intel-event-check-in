// Form elements.
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const messageElement = document.getElementById("message");
const goalReachedMessage = document.getElementById("goalReachedMessage");
const confetti = document.getElementById("confetti");

// Attendance elements and settings.
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const maxCount = 50;

const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

function getAttendeeList() {
  return JSON.parse(localStorage.getItem("attendanceAttendeeList") || "[]");
}

function getTeamValue(attendee) {
  if (attendee.team === "Team Water Wise") {
    return "water";
  }

  if (attendee.team === "Team Net Zero") {
    return "zero";
  }

  if (attendee.team === "Team Renewables") {
    return "power";
  }

  return attendee.team;
}

function showConfetti() {
  const confettiColors = [
    "#0071c5",
    "#00aeef",
    "#72b043",
    "#f7a800",
    "#e85d75",
  ];

  confetti.innerHTML = "";

  for (let index = 0; index < 40; index++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = confettiColors[index % confettiColors.length];
    piece.style.animationDelay = `${Math.random() * 1.5}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    confetti.appendChild(piece);
  }
}

function displayAttendance() {
  const attendeeList = getAttendeeList();
  const percentage = Math.min(
    Math.round((attendeeList.length / maxCount) * 100),
    100,
  );

  // Update the main attendance tracker.
  attendeeCount.textContent = attendeeList.length;
  progressBar.style.width = `${percentage}%`;
  localStorage.setItem("attendanceCount", attendeeList.length);
  localStorage.setItem("attendanceProgress", `${percentage}%`);

  // Clear the team counters and member lists before redrawing them.
  const teamValues = ["water", "zero", "power"];
  const teamCounts = {
    water: 0,
    zero: 0,
    power: 0,
  };

  teamValues.forEach(function (team) {
    document.getElementById(`${team}Count`).textContent = "0";
    document.getElementById(`${team}AttendeeList`).innerHTML = "";
  });

  attendeeList.forEach(function (attendee) {
    const team = getTeamValue(attendee);
    const teamCounter = document.getElementById(`${team}Count`);
    const teamList = document.getElementById(`${team}AttendeeList`);

    if (teamCounter && teamList) {
      teamCounts[team]++;
      teamCounter.textContent = teamCounts[team];

      const listItem = document.createElement("li");
      listItem.textContent = attendee.name;
      teamList.appendChild(listItem);
    }
  });

  if (attendeeList.length >= maxCount) {
    const highestCount = Math.max(
      teamCounts.water,
      teamCounts.zero,
      teamCounts.power,
    );
    const winningTeams = teamValues.filter(function (team) {
      return teamCounts[team] === highestCount;
    });
    const winningTeamNames = winningTeams.map(function (team) {
      return teamNames[team];
    });

    goalReachedMessage.textContent = `🎉 Attendance goal reached! Winner: ${winningTeamNames.join(" and ")} 🎉`;
    goalReachedMessage.style.display = "block";
    showConfetti();
  } else {
    goalReachedMessage.style.display = "none";
    confetti.innerHTML = "";
  }
}

displayAttendance();

// Handle a new check-in.
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const attendeeName = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;
  const attendeeList = getAttendeeList();

  attendeeList.push({ name: attendeeName, team: team });
  localStorage.setItem("attendanceAttendeeList", JSON.stringify(attendeeList));

  displayAttendance();

  const message = `Welcome, ${attendeeName} from ${teamName}`;
  messageElement.textContent = message;
  messageElement.className = team;
  messageElement.style.display = "block";

  form.reset();
});
