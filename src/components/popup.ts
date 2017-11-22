import queryString from 'query-string';

function close(popup, intervalId) {
  if (intervalId) {
    window.clearInterval(intervalId);
  }

  popup.close();

  return null;
}

export default ({ url, id, width, height }) => {
  return new Promise((resolve, reject) => {
    const popup = window.open(url, id, `width=${width},height=${height}`);

    let intervalId: any = window.setInterval(() => {
      try {
        if (!popup || popup.closed !== false) {
          intervalId = close(popup, intervalId);
          reject(new Error('The popup was closed'));
        } else if (popup.location.href !== url && popup.location.pathname !== 'blank') {
          const params = queryString.parse(popup.location.search);
          intervalId = close(popup, intervalId);
          resolve(params);
        }
      } catch (error) {}
    }, 100);
  });
};
