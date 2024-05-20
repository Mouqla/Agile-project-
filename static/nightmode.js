const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
const systemSettinglight = window.matchMedia("(prefers-color-scheme: light)");

const theme = localStorage.getItem("data-theme");
if (theme) {
    document.documentElement.setAttribute('data-theme', theme);  
}

const currentTheme = document.documentElement.getAttribute('data-theme');
const themeText = currentTheme === 'dark' ? 'Switch to light' : 'Switch to dark';
document.getElementById("nightswitch").textContent = themeText;


function toggle(){
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const switchTo = currentTheme === 'light' ? 'dark' : 'light';
    const themeText = currentTheme === 'dark' ? 'Switch to dark' : 'Switch to light';
    document.documentElement.setAttribute('data-theme', switchTo);
    document.getElementById("nightswitch").textContent = themeText;
    localStorage.setItem("data-theme", switchTo);
}
