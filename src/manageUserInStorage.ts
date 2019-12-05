import { RandomAvatarOptions } from "./AvatarGenerator";
import Chance from "chance";
const chance = new Chance();

const randomUsername = chance.word({ length: 6 });
const localStorageUsername = localStorage.getItem("messaging-app-user-config-username");

const localStorageAvatarOptions = localStorage.getItem("messaging-app-user-config-avatarOptions");

// re-use the localStorage versions of username and avatarOptions
export const username = localStorageUsername ? localStorageUsername : randomUsername;
export const avatarOptions = localStorageAvatarOptions ? JSON.parse(localStorageAvatarOptions) : RandomAvatarOptions;

if (!localStorageUsername) localStorage.setItem("messaging-app-user-config-username", username);
if (!localStorageAvatarOptions)
  localStorage.setItem("messaging-app-user-config-avatarOptions", JSON.stringify(RandomAvatarOptions));
