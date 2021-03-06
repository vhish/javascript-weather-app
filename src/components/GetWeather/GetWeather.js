const GetWeather = (() => {
  const defaultURL = 'https://api.openweathermap.org/data/2.5/';

  const API_KEY = '5ca8840c0dee5c8795633cf806e88dfc';

  const processData = (rustyData, requestType) => {
    const weatherObj = {};

    switch (requestType) {
      case 'weather': {
        const { name, weather, main } = rustyData;
        const { description, id } = weather[0];
        const { temp } = main;

        weatherObj.city = name;
        weatherObj.description = description;
        weatherObj.id = id;
        weatherObj.temp = temp;

        break;
      }
      case 'forecast': {
        const { list } = rustyData;

        const forecastArr = [];

        for (let i = 0; i < 5; i += 1) {
          const item = list[i];
          const { weather, main } = item;
          const dtTxt = item.dt_txt;
          const { temp } = main;
          const { id } = weather[0];

          forecastArr.push({
            temp,
            dtTxt,
            id,
          });
        }

        weatherObj.weatherArr = forecastArr;
        break;
      }
      default:
    }

    weatherObj.requestType = requestType;

    return weatherObj;
  };

  const fetchData = async (request) => {
    try {
      const response = await fetch(request, { mode: 'cors' });

      if (response.ok) {
        return response.json();
      }
    } catch (e) {
      return undefined;
    }
    return undefined;
  };

  const fetchWeather = async (requestType, cityName) => {
    let request = `${defaultURL}${requestType}?q=${cityName}&APPID=${API_KEY}&units=metric`;

    if (requestType === 'forecast') request += '&cnt=5';

    const data = processData(await fetchData(request), requestType);

    return data;
  };

  return {
    fetchWeather,
  };
})();

export default GetWeather;
