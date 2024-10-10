
async function getUserInfo() {
  const usernameInput = document.getElementById('username');
  const resultContainer = document.getElementById('result');
  const loadingIndicator = document.getElementById('loadingIndicator');

  const username = usernameInput.value;
  resultContainer.innerHTML = ''; // Clear previous results

  try {
    // Show loading indicator
    loadingIndicator.style.display = 'inline-block';

    // Fetch user information
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    const userData = await userResponse.json();

    if (userResponse.status === 404) {
      resultContainer.innerHTML = `<div class="alert alert-danger">Invalid username: ${username}</div>`;
      return;
    }

    // Fetch user repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
    const reposData = await reposResponse.json();
    const starredResponse = await fetch(`https://api.github.com/users/${username}/starred`);
    const starredData = await starredResponse.json();

    // Display user information
    const userInfo = `
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">User Information</h5>
          <img src="${userData.avatar_url}" class="rounded-circle" alt="Avatar" width="100">
          <p><strong>Username:</strong> ${userData.login}</p>
          <p><strong>Name:</strong> ${userData.name || 'Not available'}</p>
          <p><strong>Bio:</strong> ${userData.bio || 'Not available'}</p>
          <p><strong>Location:</strong> ${userData.location || 'Not available'}</p>
          <p><strong>Email:</strong> ${userData.email || 'Not available'}</p>
          <p><strong>Company:</strong> ${userData.company || 'Not available'}</p>
          <p><strong>Public Repositories:</strong> ${userData.public_repos}</p>
          <p><strong>Top Languages:</strong> ${getTopLanguages(reposData)}</p>
          <p><strong>Followers:</strong> ${userData.followers}</p>
          <p><strong>Following:</strong> ${userData.following}</p>
          <p><strong>Created at:</strong> ${new Date(userData.created_at).toLocaleDateString()}</p>
          <p><strong>Updated at:</strong> ${new Date(userData.updated_at).toLocaleDateString()}</p>
        </div>
      </div>
    `;

    // GitHub Contributions Chart
    const chartImage = `
      <h2>GitHub Contributions Chart:</h2>
      <img src="https://ghchart.rshah.org/${username}" alt="GitHub Contributions Chart" />
    `;

    // Display user repositories in a table with clickable links
    const repoTable = `
      <h2>Repositories:</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Language</th>
            <th>Stars</th>
            <th>Forks</th>
            <th>Open Issues</th>
          </tr>
        </thead>
        <tbody>
          ${reposData.map(repo => `
            <tr>
              <td><a href="${repo.html_url}" target="_blank">${repo.name}</a></td>
              <td>${repo.description || 'Not available'}</td>
              <td>${repo.language || 'Not available'}</td>
              <td>${repo.stargazers_count}</td>
              <td>${repo.forks_count}</td>
              <td>${repo.open_issues_count}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Display user starred repositories in a table with clickable links
    const starredTable = `
      <h2>Starred Repositories:</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Language</th>
          </tr>
        </thead>
        <tbody>
          ${starredData.map(starredRepo => `
            <tr>
              <td><a href="${starredRepo.html_url}" target="_blank">${starredRepo.name}</a></td>
              <td>${starredRepo.description || 'Not available'}</td>
              <td>${starredRepo.language || 'Not available'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    resultContainer.innerHTML = userInfo + chartImage + repoTable + starredTable;
  } catch (error) {
    resultContainer.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
  } finally {
    // Hide loading indicator
    loadingIndicator.style.display = 'none';
  }
}


function getTopLanguages(repos) {
  // Extract languages from all repositories
  const allLanguages = repos.reduce((languages, repo) => {
    if (repo.language) {
      languages.push(repo.language);
    }
    return languages;
  }, []);

  // Count the occurrences of each language
  const languageCounts = allLanguages.reduce((counts, language) => {
    counts[language] = (counts[language] || 0) + 1;
    return counts;
  }, {});

  // Sort languages by count in descending order
  const sortedLanguages = Object.keys(languageCounts).sort((a, b) => languageCounts[b] - languageCounts[a]);

  // Get the top 3 languages
  const topLanguages = sortedLanguages.slice(0, 3);

  return topLanguages.join(', ');
}
