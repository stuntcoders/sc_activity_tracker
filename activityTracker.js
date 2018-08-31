Activity = (() => {
  let alertTime;
  let alertMessage;
  let totalIdleTimeInsideOfTab = 0;
  let idle = 0;
  let inactive = true;
  let notificationShowCount = 0;
  let totalIdleTimeOutsideOfTab = 0;
  let isTabActive = true;
  let leaveTabTime;
  let openTabTime;
  let seconds = 0;
  let numberOfCopies = 0;
  let numberOfPastes = 0;
  let numberOfCuts = 0;
  let timeoutEventChecker;

  let activityStatistics = {
    numberOfCopies,
    numberOfPastes,
    numberOfCuts,
    totalIdleTimeOutsideOfTab,
    totalIdleTimeInsideOfTab,
    openTabTime,
    leaveTabTime
  };

  const getActivityStatistics = () => activityStatistics;

  const init = (Time, Message) => {
    alertTime = Time;
    alertMessage = Message;
  };

  function showPopUp() {
    if (notificationShowCount < 1) {
      alert(alertMessage);
    }
    notificationShowCount++;
  }

  function getFocus() {
    window.onfocus = () => {
      if (isTabActive === false) {
        isTabActive = true;
        openTabTime = new Date();
        activityStatistics.openTabTime = openTabTime;
        seconds = (openTabTime - leaveTabTime) / 1000;
        totalIdleTimeOutsideOfTab += seconds;
        activityStatistics.totalIdleTimeOutsideOfTab = totalIdleTimeOutsideOfTab.toFixed(
          2
        );
      }
    };

    window.onblur = () => {
      if (isTabActive === true) {
        isTabActive = false;
        leaveTabTime = new Date();
        activityStatistics.leaveTabTime = leaveTabTime;
      }
    };
  }
  getFocus();

  window.setInterval(() => {
    if (isTabActive === false) {
      seconds = (leaveTabTime - openTabTime) / 1000;
      showPopUp();
    } else {
      if (seconds >= alertTime) {
        showPopUp();
      }
    }
  }, 1000);

  document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key === "c") {
      numberOfCopies++;
      activityStatistics.numberOfCopies = numberOfCopies;
    }

    if (e.ctrlKey && e.key === "x") {
      numberOfCuts++;
      activityStatistics.numberOfCuts = numberOfCuts;
    }

    if (e.ctrlKey && e.key === "v") {
      numberOfPastes++;
      activityStatistics.numberOfPastes = numberOfPastes;
    }
  });

  function setup() {
    this.addEventListener("mousemove", resetTimer, false);
    this.addEventListener("mousedown", resetTimer, false);
    this.addEventListener("keypress", resetTimer, false);
    this.addEventListener("DOMMouseScroll", resetTimer, false);
    this.addEventListener("mousewheel", resetTimer, false);
    this.addEventListener("touchmove", resetTimer, false);
    this.addEventListener("MSPointerMove", resetTimer, false);

    startTimer();
  }
  setup();

  function startTimer() {
    if (isTabActive === true) {
      timeoutEventChecker = window.setTimeout(goInactive, 5000);
    }
  }

  function resetTimer() {
    window.clearTimeout(timeoutEventChecker);
    goActive();
  }

  function goInactive() {
    if (inactive === true) {
      idle = new Date();
    }
    inactive = false;
  }

  function goActive() {
    if (inactive === false) {
      totalIdleTimeInsideOfTab =
        totalIdleTimeInsideOfTab + (new Date() - idle) / 1000;
      activityStatistics.totalIdleTimeInsideOfTab = totalIdleTimeInsideOfTab.toFixed(
        2
      );
    }
    inactive = true;
    startTimer();
  }

  return {
    init,
    getActivityStatistics
  };
})();
