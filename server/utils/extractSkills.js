const SKILLS = [
    "javascript",
    "react",
    "node",
    "mongodb",
    "express",
    "python",
    "java",
    "c++",
    "html",
    "css",
    "sql",
    "git",
    "docker"
];

export const extractSkills = (text) => {

    const lowerText = text.toLowerCase();

    return SKILLS.filter(skill =>
        lowerText.includes(skill)
    );
};