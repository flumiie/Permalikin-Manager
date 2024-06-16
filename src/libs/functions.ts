import { PermissionsAndroid } from 'react-native';

function decimalize(num: number) {
  var str = num.toString().split('.');
  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  }
  return str.join('.');
}

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

const getProvincesFromCountry = (country: string | undefined) => {
  let result = [''];

  if (country === 'Afghanistan') {
    result = require('./province/afghanistan.json');
  }
  if (country === 'Albania') {
    result = require('./province/albania.json');
  }
  if (country === 'Algeria') {
    result = require('./province/algeria.json');
  }
  if (country === 'Andorra') {
    result = require('./province/andorra.json');
  }
  if (country === 'Angola') {
    result = require('./province/angola.json');
  }
  if (country === 'Antigua and Barbuda') {
    result = require('./province/antigua-and-barbuda.json');
  }
  if (country === 'Argentina') {
    result = require('./province/argentina.json');
  }
  if (country === 'Armenia') {
    result = require('./province/armenia.json');
  }
  if (country === 'Australia') {
    result = require('./province/australia.json');
  }
  if (country === 'Austria') {
    result = require('./province/austria.json');
  }
  if (country === 'Azerbaijan') {
    result = require('./province/azerbaijan.json');
  }
  if (country === 'Bahamas') {
    result = require('./province/bahamas.json');
  }
  if (country === 'Bahrain') {
    result = require('./province/bahrain.json');
  }
  if (country === 'Bangladesh') {
    result = require('./province/bangladesh.json');
  }
  if (country === 'Barbados') {
    result = require('./province/barbados.json');
  }
  if (country === 'Belarus') {
    result = require('./province/belarus.json');
  }
  if (country === 'Belgium') {
    result = require('./province/belgium.json');
  }
  if (country === 'Belize') {
    result = require('./province/belize.json');
  }
  if (country === 'Benin') {
    result = require('./province/benin.json');
  }
  if (country === 'Bhutan') {
    result = require('./province/bhutan.json');
  }
  if (country === 'Bolivia') {
    result = require('./province/bolivia.json');
  }
  if (country === 'Bosnia and Herzegovina') {
    result = require('./province/bosnia-and-herzegovina.json');
  }
  if (country === 'Botswana') {
    result = require('./province/botswana.json');
  }
  if (country === 'Brazil') {
    result = require('./province/brazil.json');
  }
  if (country === 'Brunei Darussalam') {
    result = require('./province/brunei-darussalam.json');
  }
  if (country === 'Bulgaria') {
    result = require('./province/bulgaria.json');
  }
  if (country === 'Burkina Faso') {
    result = require('./province/burkina-faso.json');
  }
  if (country === 'Burundi') {
    result = require('./province/burundi.json');
  }
  if (country === 'Cambodia') {
    result = require('./province/cambodia.json');
  }
  if (country === 'Cameroon') {
    result = require('./province/cameroon.json');
  }
  if (country === 'Canada') {
    result = require('./province/canada.json');
  }
  if (country === 'Cape Verde') {
    result = require('./province/cape-verde.json');
  }
  if (country === 'Central African Republic') {
    result = require('./province/central-african-republic.json');
  }
  if (country === 'Chad') {
    result = require('./province/chad.json');
  }
  if (country === 'Chile') {
    result = require('./province/chile.json');
  }
  if (country === 'China') {
    result = require('./province/china.json');
  }
  if (country === 'Colombia') {
    result = require('./province/colombia.json');
  }
  if (country === 'Comoros') {
    result = require('./province/comoros.json');
  }
  if (country === 'Congo') {
    result = require('./province/congo.json');
  }
  if (country === 'Congo The Democratic Republic of the') {
    result = require('./province/congo-the-democratic-republic-of-the.json');
  }
  if (country === 'Costa Rica') {
    result = require('./province/costa-rica.json');
  }
  if (country === 'Cote D Ivoire') {
    result = require('./province/cote-d-ivoire-republic-of.json');
  }
  if (country === 'Croatia') {
    result = require('./province/croatia.json');
  }
  if (country === 'Cuba') {
    result = require('./province/cuba.json');
  }
  if (country === 'Cyprus') {
    result = require('./province/cyprus.json');
  }
  if (country === 'Czech Republic') {
    result = require('./province/czech-republic.json');
  }
  if (country === 'Denmark') {
    result = require('./province/denmark.json');
  }
  if (country === 'Djibouti') {
    result = require('./province/djibouti.json');
  }
  if (country === 'Dominica') {
    result = require('./province/dominica.json');
  }
  if (country === 'Dominican Republic') {
    result = require('./province/dominican-republic.json');
  }
  if (country === 'Ecuador') {
    result = require('./province/ecuador.json');
  }
  if (country === 'Egypt') {
    result = require('./province/egypt.json');
  }
  if (country === 'El Salvador') {
    result = require('./province/el-salvador.json');
  }
  if (country === 'Equatorial Guinea') {
    result = require('./province/equatorial-guinea.json');
  }
  if (country === 'Eritrea') {
    result = require('./province/eritrea.json');
  }
  if (country === 'Estonia') {
    result = require('./province/estonia.json');
  }
  if (country === 'Ethiopia') {
    result = require('./province/ethiopia.json');
  }
  if (country === 'Fiji') {
    result = require('./province/fiji.json');
  }
  if (country === 'Finland') {
    result = require('./province/finland.json');
  }
  if (country === 'France') {
    result = require('./province/france.json');
  }
  if (country === 'Gabon') {
    result = require('./province/gabon.json');
  }
  if (country === 'Gambia') {
    result = require('./province/gambia.json');
  }
  if (country === 'Georgia') {
    result = require('./province/georgia.json');
  }
  if (country === 'Germany') {
    result = require('./province/germany.json');
  }
  if (country === 'Ghana') {
    result = require('./province/ghana.json');
  }
  if (country === 'Greece') {
    result = require('./province/greece.json');
  }
  if (country === 'Greenland') {
    result = require('./province/greenland.json');
  }
  if (country === 'Grenada') {
    result = require('./province/grenada.json');
  }
  if (country === 'Guatemala') {
    result = require('./province/guatemala.json');
  }
  if (country === 'Guinea') {
    result = require('./province/guinea.json');
  }
  if (country === 'Guinea-Bissau') {
    result = require('./province/guinea-bissau.json');
  }
  if (country === 'Guyana') {
    result = require('./province/guyana.json');
  }
  if (country === 'Haiti') {
    result = require('./province/haiti.json');
  }
  if (country === 'Honduras') {
    result = require('./province/honduras.json');
  }
  if (country === 'Hong Kong') {
    result = require('./province/hong-kong.json');
  }
  if (country === 'Hungary') {
    result = require('./province/hungary.json');
  }
  if (country === 'Iceland') {
    result = require('./province/iceland.json');
  }
  if (country === 'India') {
    result = require('./province/india.json');
  }
  if (country === 'Indonesia') {
    result = require('./province/indonesia.json');
  }
  if (country === 'Iran') {
    result = require('./province/iran-islamic-republic-of.json');
  }
  if (country === 'Iraq') {
    result = require('./province/iraq.json');
  }
  if (country === 'Ireland') {
    result = require('./province/ireland.json');
  }
  if (country === 'Israel') {
    result = require('./province/israel.json');
  }
  if (country === 'Italy') {
    result = require('./province/italy.json');
  }
  if (country === 'Jamaica') {
    result = require('./province/jamaica.json');
  }
  if (country === 'Japan') {
    result = require('./province/japan.json');
  }
  if (country === 'Jordan') {
    result = require('./province/jordan.json');
  }
  if (country === 'Kazakhstan') {
    result = require('./province/kazakhstan.json');
  }
  if (country === 'Kenya') {
    result = require('./province/kenya.json');
  }
  if (country === 'Kiribati') {
    result = require('./province/kiribati.json');
  }
  if (country === "Korea Democratic) People'S Republic of") {
    result = require('./province/korea-democratic-people-s-republic-of.json');
  }
  if (country === 'Korea Republic of') {
    result = require('./province/korea-republic-of.json');
  }
  if (country === 'Kuwait') {
    result = require('./province/kuwait.json');
  }
  if (country === 'Kyrgyzstan') {
    result = require('./province/kyrgyzstan.json');
  }
  if (country === "Lao People'S Democratic Republic") {
    result = require('./province/lao-people-s-democratic-republic.json');
  }
  if (country === 'Latvia') {
    result = require('./province/latvia.json');
  }
  if (country === 'Lebanon') {
    result = require('./province/lebanon.json');
  }
  if (country === 'Lesotho') {
    result = require('./province/lesotho.json');
  }
  if (country === 'Liberia') {
    result = require('./province/liberia.json');
  }
  if (country === 'Libyan Arab Jamahiriya') {
    result = require('./province/libyan-arab-jamahiriya.json');
  }
  if (country === 'Liechtenstein') {
    result = require('./province/liechtenstein.json');
  }
  if (country === 'Lithuania') {
    result = require('./province/lithuania.json');
  }
  if (country === 'Luxembourg') {
    result = require('./province/luxembourg.json');
  }
  if (country === 'Macedonia The Former Yugoslav Republic of') {
    result = require('./province/macedonia-the-former-yugoslav-republic-of.json');
  }
  if (country === 'Madagascar') {
    result = require('./province/madagascar.json');
  }
  if (country === 'Malawi') {
    result = require('./province/malawi.json');
  }
  if (country === 'Malaysia') {
    result = require('./province/malaysia.json');
  }
  if (country === 'Maldives') {
    result = require('./province/maldives.json');
  }
  if (country === 'Mali') {
    result = require('./province/mali.json');
  }
  if (country === 'Malta') {
    result = require('./province/malta.json');
  }
  if (country === 'Marshall Islands') {
    result = require('./province/marshall-islands.json');
  }
  if (country === 'Mauritania') {
    result = require('./province/mauritania.json');
  }
  if (country === 'Mauritius') {
    result = require('./province/mauritius.json');
  }
  if (country === 'Mexico') {
    result = require('./province/mexico.json');
  }
  if (country === 'Micronesia Federated States of') {
    result = require('./province/micronesia-federated-states-of.json');
  }
  if (country === 'Moldova Republic of') {
    result = require('./province/moldova-republic-of.json');
  }
  if (country === 'Monaco') {
    result = require('./province/monaco.json');
  }
  if (country === 'Mongolia') {
    result = require('./province/mongolia.json');
  }
  if (country === 'Montenegro') {
    result = require('./province/montenegro.json');
  }
  if (country === 'Morocco') {
    result = require('./province/morocco.json');
  }
  if (country === 'Mozambique') {
    result = require('./province/mozambique.json');
  }
  if (country === 'Myanmar') {
    result = require('./province/myanmar.json');
  }
  if (country === 'Namibia') {
    result = require('./province/namibia.json');
  }
  if (country === 'Nepal') {
    result = require('./province/nepal.json');
  }
  if (country === 'Netherlands') {
    result = require('./province/netherlands.json');
  }
  if (country === 'New Zealand') {
    result = require('./province/new-zealand.json');
  }
  if (country === 'Nicaragua') {
    result = require('./province/nicaragua.json');
  }
  if (country === 'Niger') {
    result = require('./province/niger.json');
  }
  if (country === 'Nigeria') {
    result = require('./province/nigeria.json');
  }
  if (country === 'Norway') {
    result = require('./province/norway.json');
  }
  if (country === 'Oman') {
    result = require('./province/oman.json');
  }
  if (country === 'Pakistan') {
    result = require('./province/pakistan.json');
  }
  if (country === 'Palau') {
    result = require('./province/palau.json');
  }
  if (country === 'Palestinian Territory Occupied') {
    result = require('./province/palestinian-territory-occupied.json');
  }
  if (country === 'Panama') {
    result = require('./province/panama.json');
  }
  if (country === 'Papua New Guinea') {
    result = require('./province/papua-new-guinea.json');
  }
  if (country === 'Paraguay') {
    result = require('./province/paraguay.json');
  }
  if (country === 'Peru') {
    result = require('./province/peru.json');
  }
  if (country === 'Philippines') {
    result = require('./province/philippines.json');
  }
  if (country === 'Poland') {
    result = require('./province/poland.json');
  }
  if (country === 'Portugal') {
    result = require('./province/portugal.json');
  }
  if (country === 'Qatar') {
    result = require('./province/qatar.json');
  }
  if (country === 'Romania') {
    result = require('./province/romania.json');
  }
  if (country === 'Russian Federation') {
    result = require('./province/russian-federation.json');
  }
  if (country === 'Rwanda') {
    result = require('./province/rwanda.json');
  }
  if (country === 'Saint Helena') {
    result = require('./province/saint-helena-ascension-and-tristan-da-cunha.json');
  }
  if (country === 'Saint Kitts and Nevis') {
    result = require('./province/saint-kitts-and-nevis.json');
  }
  if (country === 'Saint Lucia') {
    result = require('./province/saint-lucia.json');
  }
  if (country === 'Saint Vincent and the Grenadines') {
    result = require('./province/saint-vincent-and-the-grenadines.json');
  }
  if (country === 'Samoa') {
    result = require('./province/samoa.json');
  }
  if (country === 'San Marino') {
    result = require('./province/san-marino.json');
  }
  if (country === 'Sao Tome and Principe') {
    result = require('./province/sao-tome-and-principe.json');
  }
  if (country === 'Saudi Arabia') {
    result = require('./province/saudi-arabia.json');
  }
  if (country === 'Senegal') {
    result = require('./province/senegal.json');
  }
  if (country === 'Serbia') {
    result = require('./province/serbia.json');
  }
  if (country === 'Seychelles') {
    result = require('./province/seychelles.json');
  }
  if (country === 'Sierra Leone') {
    result = require('./province/sierra-leone.json');
  }
  if (country === 'Singapore') {
    result = require('./province/singapore.json');
  }
  if (country === 'Slovakia') {
    result = require('./province/slovakia.json');
  }
  if (country === 'Slovenia') {
    result = require('./province/slovenia.json');
  }
  if (country === 'Solomon Islands') {
    result = require('./province/solomon-islands.json');
  }
  if (country === 'Somalia') {
    result = require('./province/somalia.json');
  }
  if (country === 'South Africa') {
    result = require('./province/south-africa.json');
  }
  if (country === 'South Sudan') {
    result = require('./province/south-sudan.json');
  }
  if (country === 'Spain') {
    result = require('./province/spain.json');
  }
  if (country === 'Sri Lanka') {
    result = require('./province/sri-lanka.json');
  }
  if (country === 'Sudan') {
    result = require('./province/sudan.json');
  }
  if (country === 'Suriname') {
    result = require('./province/suriname.json');
  }
  if (country === 'Swaziland') {
    result = require('./province/swaziland.json');
  }
  if (country === 'Sweden') {
    result = require('./province/sweden.json');
  }
  if (country === 'Switzerland') {
    result = require('./province/switzerland.json');
  }
  if (country === 'Syrian Arab Republic') {
    result = require('./province/syrian-arab-republic.json');
  }
  if (country === 'Taiwan Province of China') {
    result = require('./province/taiwan-province-of-china.json');
  }
  if (country === 'Tajikistan') {
    result = require('./province/tajikistan.json');
  }
  if (country === 'Tanzania United Republic of') {
    result = require('./province/tanzania-united-republic-of.json');
  }
  if (country === 'Thailand') {
    result = require('./province/thailand.json');
  }
  if (country === 'Timor-Leste') {
    result = require('./province/timor-leste.json');
  }
  if (country === 'Togo') {
    result = require('./province/togo.json');
  }
  if (country === 'Tonga') {
    result = require('./province/tonga.json');
  }
  if (country === 'Trinidad and Tobago') {
    result = require('./province/trinidad-and-tobago.json');
  }
  if (country === 'Tunisia') {
    result = require('./province/tunisia.json');
  }
  if (country === 'Turkey') {
    result = require('./province/turkey.json');
  }
  if (country === 'Turkmenistan') {
    result = require('./province/turkmenistan.json');
  }
  if (country === 'Tuvalu') {
    result = require('./province/tuvalu.json');
  }
  if (country === 'Uganda') {
    result = require('./province/uganda.json');
  }
  if (country === 'Ukraine') {
    result = require('./province/ukraine.json');
  }
  if (country === 'United Arab Emirates') {
    result = require('./province/united-arab-emirates.json');
  }
  if (country === 'United Kingdom') {
    result = require('./province/united-kingdom.json');
  }
  if (country === 'United States') {
    result = require('./province/united-states.json');
  }
  if (country === 'United States Minor Outlying Islands') {
    result = require('./province/united-states-minor-outlying-islands.json');
  }
  if (country === 'Uruguay') {
    result = require('./province/uruguay.json');
  }
  if (country === 'Uzbekistan') {
    result = require('./province/uzbekistan.json');
  }
  if (country === 'Vanuatu') {
    result = require('./province/vanuatu.json');
  }
  if (country === 'Venezuela') {
    result = require('./province/venezuela.json');
  }
  if (country === 'Viet Nam') {
    result = require('./province/viet-nam.json');
  }
  if (country === 'Yemen') {
    result = require('./province/yemen.json');
  }
  if (country === 'Zambia') {
    result = require('./province/zambia.json');
  }
  if (country === 'Zimbabwe') {
    result = require('./province/zimbabwe.json');
  }

  return result;
};

export { decimalize, requestLocationPermission, getProvincesFromCountry };
