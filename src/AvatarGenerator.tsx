import React from "react";
// const BASE_AVATAR_URL = `https://avataaars.io/?avatarStyle=Circle&topType=LongHairDreads&accessoriesType=Wayfarers&hairColor=Platinum&facialHairType=BeardMedium&facialHairColor=Black&clotheType=ShirtVNeck&clotheColor=PastelOrange&eyeType=Dizzy&eyebrowType=SadConcernedNatural&mouthType=Smile&skinColor=Black`;
// const AVATAR_URL = `https://avataaars.io/?avatarStyle=Circle&topType=${topType}&accessoriesType=${accessoriesType}&hairColor=${hairColor}&facialHairType=${facialHairType}&facialHairColor=${facialHairColor}&clotheType=${clotheType}&clotheColor=${clotheColor}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&mouthType=${mouthType}&skinColor=${skinColor}`;
import Avatar from "avataaars";

const avatars = [
  "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=Sunglasses&hairColor=SilverGray&facialHairType=MoustacheMagnum&facialHairColor=Red&clotheType=ShirtScoopNeck&clotheColor=Pink&eyeType=Cry&eyebrowType=SadConcerned&mouthType=Disbelief&skinColor=Yellow",
  "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraightStrand&accessoriesType=Kurt&hairColor=BrownDark&facialHairType=Blank&facialHairColor=Black&clotheType=ShirtScoopNeck&clotheColor=Black&eyeType=Wink&eyebrowType=FlatNatural&mouthType=Eating&skinColor=Yellow",
  "https://avataaars.io/?avatarStyle=Circle&topType=WinterHat1&accessoriesType=Prescription01&hatColor=Red&hairColor=Red&facialHairType=MoustacheFancy&facialHairColor=Red&clotheType=CollarSweater&clotheColor=Blue02&eyeType=EyeRoll&eyebrowType=FlatNatural&mouthType=Twinkle&skinColor=Yellow",
  "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairSides&accessoriesType=Prescription01&hatColor=Gray02&hairColor=PastelPink&facialHairType=MoustacheFancy&facialHairColor=Auburn&clotheType=BlazerSweater&clotheColor=Blue02&eyeType=WinkWacky&eyebrowType=DefaultNatural&mouthType=Sad&skinColor=DarkBrown",
  "https://avataaars.io/?avatarStyle=Circle&topType=WinterHat4&accessoriesType=Round&hatColor=Gray01&hairColor=Platinum&facialHairType=BeardMagestic&facialHairColor=Brown&clotheType=ShirtCrewNeck&clotheColor=PastelBlue&eyeType=Surprised&eyebrowType=UpDown&mouthType=Sad&skinColor=Tanned",
  "https://avataaars.io/?avatarStyle=Circle&topType=LongHairDreads&accessoriesType=Sunglasses&hatColor=Pink&hairColor=PastelPink&facialHairType=Blank&facialHairColor=BrownDark&clotheType=Hoodie&clotheColor=PastelOrange&eyeType=Happy&eyebrowType=SadConcerned&mouthType=Serious&skinColor=Yellow",
  "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairSides&accessoriesType=Sunglasses&hairColor=Red&facialHairType=BeardMagestic&facialHairColor=Platinum&clotheType=Hoodie&clotheColor=PastelYellow&eyeType=Dizzy&eyebrowType=RaisedExcited&mouthType=Sad&skinColor=Tanned",
  "https://avataaars.io/?avatarStyle=Circle&topType=LongHairFro&accessoriesType=Prescription01&hairColor=Blonde&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=ShirtScoopNeck&clotheColor=Black&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Tongue&skinColor=Tanned",
  "https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Kurt&hairColor=Red&facialHairType=BeardMagestic&facialHairColor=Platinum&clotheType=GraphicShirt&clotheColor=Gray02&graphicType=Skull&eyeType=Surprised&eyebrowType=UpDownNatural&mouthType=Smile&skinColor=Tanned",
  "https://avataaars.io/?avatarStyle=Circle&topType=WinterHat1&accessoriesType=Round&hatColor=Gray02&facialHairType=MoustacheFancy&facialHairColor=BrownDark&clotheType=GraphicShirt&clotheColor=Heather&graphicType=Hola&eyeType=Close&eyebrowType=UpDown&mouthType=Tongue&skinColor=Pale",
  "https://avataaars.io/?avatarStyle=Circle&topType=LongHairDreads&accessoriesType=Prescription02&hatColor=Gray01&hairColor=Red&facialHairType=BeardMagestic&facialHairColor=BrownDark&clotheType=Hoodie&clotheColor=Heather&graphicType=Deer&eyeType=Default&eyebrowType=UpDownNatural&mouthType=ScreamOpen&skinColor=Yellow",
  "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShaggyMullet&accessoriesType=Prescription01&hairColor=SilverGray&facialHairType=MoustacheFancy&facialHairColor=Red&clotheType=BlazerSweater&clotheColor=Blue01&eyeType=Surprised&eyebrowType=SadConcerned&mouthType=Grimace&skinColor=Light",
  "https://avataaars.io/?avatarStyle=Circle&topType=WinterHat2&accessoriesType=Round&hatColor=Pink&hairColor=BlondeGolden&facialHairType=Blank&facialHairColor=Black&clotheType=ShirtVNeck&clotheColor=Pink&eyeType=Side&eyebrowType=Default&mouthType=Tongue&skinColor=Black",
  "https://avataaars.io/?avatarStyle=Circle&topType=LongHairCurly&accessoriesType=Kurt&hairColor=PastelPink&facialHairType=Blank&facialHairColor=BrownDark&clotheType=ShirtVNeck&clotheColor=Red&eyeType=Cry&eyebrowType=DefaultNatural&mouthType=Sad&skinColor=Tanned",
  "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Sunglasses&hairColor=PastelPink&facialHairType=BeardMagestic&facialHairColor=Brown&clotheType=BlazerSweater&eyeType=Squint&eyebrowType=SadConcerned&mouthType=Disbelief&skinColor=Brown"
];

// export const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

function randomOptionFromList<T>(list: Array<T>): T {
  return list[Math.floor(Math.random() * list.length)];
}
const avatarOptions = {
  topType: [
    "NoHair",
    "Eyepatch",
    "Hat",
    "Hijab",
    "Turban",
    "WinterHat1",
    "WinterHat2",
    "WinterHat3",
    "WinterHat4",
    "LongHairBigHair",
    "LongHairBob",
    "LongHairBun",
    "LongHairCurly",
    "LongHairCurvy",
    "LongHairDreads",
    "LongHairFrida",
    "LongHairFro",
    "LongHairFroBand",
    "LongHairNotTooLong",
    "LongHairShavedSides",
    "LongHairMiaWallace",
    "LongHairStraight",
    "LongHairStraight2",
    "LongHairStraightStrand",
    "ShortHairDreads01",
    "ShortHairDreads02",
    "ShortHairFrizzle",
    "ShortHairShaggyMullet",
    "ShortHairShortCurly",
    "ShortHairShortFlat",
    "ShortHairShortRound",
    "ShortHairShortWaved",
    "ShortHairSides",
    "ShortHairTheCaesar",
    "ShortHairTheCaesarSidePart"
  ],
  accessoriesType: [
    "Blank",
    "Kurt",
    "Prescription01",
    "Prescription02",
    "Round",
    "Sunglasses",
    "Wayfarers"
  ],
  hatColor: [
    "Black",
    "Blue01",
    "Blue02",
    "Blue03",
    "Gray01",
    "Gray02",
    "Heather",
    "PastelBlue",
    "PastelGreen",
    "PastelOrange",
    "PastelRed",
    "PastelYellow",
    "Pink",
    "Red",
    "White"
  ],
  hairColor: [
    "Auburn",
    "Black",
    "Blonde",
    "BlondeGolden",
    "Brown",
    "BrownDark",
    "PastelPink",
    "Platinum",
    "Red",
    "SilverGray"
  ],
  facialHairType: [
    "Blank",
    "BeardMedium",
    "BeardLight",
    "BeardMajestic",
    "MoustacheFancy",
    "MoustacheMagnum"
  ],
  facialHairColor: [
    "Auburn",
    "Black",
    "Blonde",
    "BlondeGolden",
    "Brown",
    "BrownDark",
    "Platinum",
    "Red"
  ],
  clotheType: [
    "BlazerShirt",
    "BlazerSweater",
    "CollarSweater",
    "GraphicShirt",
    "Hoodie",
    "Overall",
    "ShirtCrewNeck",
    "ShirtScoopNeck",
    "ShirtVNeck"
  ],
  clotheColor: [
    "Black",
    "Blue01",
    "Blue02",
    "Blue03",
    "Gray01",
    "Gray02",
    "Heather",
    "PastelBlue",
    "PastelGreen",
    "PastelOrange",
    "PastelRed",
    "PastelYellow",
    "Pink",
    "Red",
    "White"
  ],
  graphicType: [
    "Bat",
    "Cumbia",
    "Deer",
    "Diamond",
    "Hola",
    "Pizza",
    "Resist",
    "Selena",
    "Bear",
    "SkullOutline",
    "Skull"
  ],
  eyeType: [
    "Close",
    "Cry",
    "Default",
    "Dizzy",
    "EyeRoll",
    "Happy",
    "Hearts",
    "Side",
    "Squint",
    "Surprised",
    "Wink",
    "WinkWacky"
  ],
  eyebrowType: [
    "Angry",
    "AngryNatural",
    "Default",
    "DefaultNatural",
    "FlatNatural",
    "RaisedExcited",
    "RaisedExcitedNatural",
    "SadConcerned",
    "SadConcernedNatural",
    "UnibrowNatural",
    "UpDown",
    "UpDownNatural"
  ],
  mouthType: [
    "Concerned",
    "Default",
    "Disbelief",
    "Eating",
    "Grimace",
    "Sad",
    "ScreamOpen",
    "Serious",
    "Smile",
    "Tongue",
    "Twinkle",
    "Vomit"
  ],
  skinColor: [
    "Tanned",
    "Yellow",
    "Pale",
    "Light",
    "Brown",
    "DarkBrown",
    "Black"
  ]
};

export const RandomAvatarOptions = {
  avatarStyle: "Circle",
  topType: randomOptionFromList(avatarOptions.topType),
  accessoriesType: randomOptionFromList(avatarOptions.accessoriesType),
  hairColor: randomOptionFromList(avatarOptions.hairColor),
  facialHairType: randomOptionFromList(avatarOptions.facialHairType),
  facialHairColor: randomOptionFromList(avatarOptions.facialHairColor),
  clotheColor: randomOptionFromList(avatarOptions.clotheColor),
  clotheType: randomOptionFromList(avatarOptions.clotheType),
  eyeType: randomOptionFromList(avatarOptions.eyeType),
  eyebrowType: randomOptionFromList(avatarOptions.eyebrowType),
  mouthType: randomOptionFromList(avatarOptions.mouthType),
  skinColor: randomOptionFromList(avatarOptions.skinColor)
};
export const RandomAvatar = (props: typeof RandomAvatarOptions) => (
  <Avatar {...props} style={{ width: "100px", height: "100px" }} />
);
