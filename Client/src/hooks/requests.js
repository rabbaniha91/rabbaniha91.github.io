const API_URL = "v1";

async function httpGetPlanets() {
  const responce = await fetch(`${API_URL}/planets`);
  return await responce.json();
}

async function httpGetLaunches() {
  const responce = await fetch(`${API_URL}/launches`);
  const fetchedLaunched = await responce.json();
  return fetchedLaunched.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    return { ok: false };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete"
    })
  } catch (err) {
    return {
      ok: false
    }
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
