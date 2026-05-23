// Código ISO para flagcdn
export const FCODE = {
  'México':'mx','Mexico':'mx','South Africa':'za','Korea Republic':'kr',
  'Czechia':'cz','Canada':'ca','Bosnia and Herzegovina':'ba','Qatar':'qa',
  'Switzerland':'ch','Brazil':'br','Morocco':'ma','Haiti':'ht',
  'Scotland':'gb-sct','USA':'us','Paraguay':'py','Australia':'au',
  'Türkiye':'tr','Turkiye':'tr','Germany':'de','Curaçao':'cw','Curacao':'cw',
  "Côte d'Ivoire":'ci','Ecuador':'ec','Netherlands':'nl','Japan':'jp',
  'Sweden':'se','Tunisia':'tn','Belgium':'be','Egypt':'eg','IR Iran':'ir',
  'New Zealand':'nz','Spain':'es','Cabo Verde':'cv','Saudi Arabia':'sa',
  'Uruguay':'uy','France':'fr','Senegal':'sn','Iraq':'iq','Norway':'no',
  'Argentina':'ar','Algeria':'dz','Austria':'at','Jordan':'jo',
  'Portugal':'pt','Congo DR':'cd','Uzbekistan':'uz','Colombia':'co',
  'England':'gb-eng','Croatia':'hr','Ghana':'gh','Panama':'pa',
};

// Nombres en español
export const PES = {
  'México':'México','Mexico':'México','South Africa':'Sudáfrica',
  'Korea Republic':'Corea del Sur','Czechia':'Chequia','Canada':'Canadá',
  'Bosnia and Herzegovina':'Bosnia y Herz.','Qatar':'Qatar',
  'Switzerland':'Suiza','Brazil':'Brasil','Morocco':'Marruecos',
  'Haiti':'Haití','Scotland':'Escocia','USA':'EE.UU.','Paraguay':'Paraguay',
  'Australia':'Australia','Türkiye':'Türkiye','Turkiye':'Türkiye',
  'Germany':'Alemania','Curaçao':'Curaçao','Curacao':'Curaçao',
  "Côte d'Ivoire":'Costa de Marfil','Ecuador':'Ecuador',
  'Netherlands':'Países Bajos','Japan':'Japón','Sweden':'Suecia',
  'Tunisia':'Túnez','Belgium':'Bélgica','Egypt':'Egipto','IR Iran':'Irán',
  'New Zealand':'Nueva Zelanda','Spain':'España','Cabo Verde':'Cabo Verde',
  'Saudi Arabia':'Arabia Saudita','Uruguay':'Uruguay','France':'Francia',
  'Senegal':'Senegal','Iraq':'Irak','Norway':'Noruega','Argentina':'Argentina',
  'Algeria':'Argelia','Austria':'Austria','Jordan':'Jordania',
  'Portugal':'Portugal','Congo DR':'Congo RD','Uzbekistan':'Uzbekistán',
  'Colombia':'Colombia','England':'Inglaterra','Croatia':'Croacia',
  'Ghana':'Ghana','Panama':'Panamá',
};

// Códigos FIFA para ranking
export const FCODE3 = {
  'México':'MX','South Africa':'ZA','Korea Republic':'KOR','Czechia':'CZE',
  'Canada':'CAN','Bosnia and Herzegovina':'BIH','Qatar':'QAT',
  'Switzerland':'SUI','Brazil':'BRA','Morocco':'MAR','Haiti':'HAI',
  'Scotland':'SCO','USA':'USA','Paraguay':'PAR','Australia':'AUS',
  'Türkiye':'TUR','Germany':'GER','Curaçao':'CUR',"Côte d'Ivoire":'CIV',
  'Ecuador':'ECU','Netherlands':'NED','Japan':'JPN','Sweden':'SWE',
  'Tunisia':'TUN','Belgium':'BEL','Egypt':'EGY','IR Iran':'IRN',
  'New Zealand':'NZL','Spain':'ESP','Cabo Verde':'CPV',
  'Saudi Arabia':'KSA','Uruguay':'URU','France':'FRA','Senegal':'SEN',
  'Iraq':'IRQ','Norway':'NOR','Argentina':'ARG','Algeria':'ALG',
  'Austria':'AUT','Jordan':'JOR','Portugal':'POR','Congo DR':'COD',
  'Uzbekistan':'UZB','Colombia':'COL','England':'ENG','Croatia':'CRO',
  'Ghana':'GHA','Panama':'PAN',
};

export const fn = (nombre) => PES[nombre] || nombre;
export const fc = (nombre) => FCODE3[nombre] || nombre.slice(0,3).toUpperCase();
export const flagUrl = (nombre, w=80) => {
  const code = FCODE[nombre];
  if (!code) return null;
  return `https://flagcdn.com/w${w}/${code}.png`;
};

// Selecciones en español para dropdowns bonus
export const SELECCIONES = [
  'Argentina','Alemania','Arabia Saudita','Australia','Austria',
  'Bélgica','Bosnia y Herz.','Brasil','Canadá','Cabo Verde',
  'Chequia','Corea del Sur','Colombia','Congo RD','Costa de Marfil',
  'Croacia','Curaçao','Ecuador','Egipto','Escocia','España','EE.UU.',
  'Francia','Ghana','Haití','Inglaterra','Irak','Irán','Japón',
  'Jordania','Marruecos','México','Nueva Zelanda','Noruega',
  'Países Bajos','Panamá','Paraguay','Portugal','Qatar','Senegal',
  'Sudáfrica','Suecia','Suiza','Túnez','Türkiye','Uruguay','Uzbekistán',
].sort();
