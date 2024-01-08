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
      resultContainer.innerHTML = `<p>Invalid username: ${username}</p>`;
      return;
    }

    // Fetch user repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
    const reposData = await reposResponse.json();

    // Display user information
    const userInfo = `
      <p><strong>Username:</strong> ${userData.login}</p>
      <p><strong>Name:</strong> ${userData.name || 'Not available'}</p>
      <p><strong>Bio:</strong> ${userData.bio || 'Not available'}</p>
      <p><strong>Location:</strong> ${userData.location || 'Not available'}</p>
      <p><strong>Email:</strong> ${userData.email || 'Not available'}</p>
      <p><strong>Company:</strong> ${userData.company || 'Not available'}</p>
      <p><strong>Public Repositories:</strong> ${userData.public_repos}</p>
      <p><strong>Top Languages:</strong> ${getTopLanguages(reposData)}</p> <!-- Added this line -->
      <p><strong>Followers:</strong> ${userData.followers}</p>
      <p><strong>Following:</strong> ${userData.following}</p>
      <p><strong>Created at:</strong> ${new Date(userData.created_at).toLocaleDateString()}</p>
      <p><strong>Updated at:</strong> ${new Date(userData.updated_at).toLocaleDateString()}</p>
    `;

    // Display user repositories in a table with clickable links
    const repoTable = `
      <h2>Repositories:</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Language</th>
          </tr>
        </thead>
        <tbody>
          ${reposData.map(repo => `
            <tr>
              <td><a href="${repo.html_url}" target="_blank">${repo.name}</a></td>
              <td>${repo.description || 'Not available'}</td>
              <td>${repo.language || 'Not available'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    resultContainer.innerHTML = userInfo + repoTable;
  } catch (error) {
    resultContainer.innerHTML = `<p>Error: ${error.message}</p>`;
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

