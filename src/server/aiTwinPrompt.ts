import { portfolioData } from '../data/portfolioData';
import en from '../locales/en.json';

/**
 * Builds the system prompt for the AI twin from the single sources of truth:
 * structural data from `portfolioData` + human-readable texts from the EN
 * locale (roles, periods, achievements, project and interest descriptions).
 *
 * NOTE: uses relative imports only — this module is consumed by the Vercel
 * serverless function in /api, which doesn't know Vite's `@` alias.
 */

const bento = en.bento;

function personalSection(): string {
  const p = portfolioData.personalInfo;
  return [
    `Name: ${p.name}`,
    `Title: ${p.title} (${p.experienceYears}+ years of experience)`,
    `About: ${p.about}`,
    `Contacts: email ${p.email}, telegram ${p.telegram}, GitHub ${p.github}, LinkedIn ${p.linkedin}, website ${p.website}`,
  ].join('\n');
}

function skillsSection(): string {
  const s = portfolioData.skills;
  return [
    `Frontend: ${s.frontend.join(', ')}`,
    `Architecture: ${s.architecture.join(', ')}`,
    `Tools & AI: ${s.toolsAndAI.join(', ')}`,
  ].join('\n');
}

function experienceSection(): string {
  return portfolioData.experience
    .map((job) => {
      const texts = bento.experience.jobs[job.id];
      const achievements = texts.achievements.map((a) => `  - ${a}`).join('\n');
      return [
        `${job.company} — ${texts.role} (${texts.period}, ${texts.location})`,
        achievements,
        `  Tech: ${job.techStack.join(', ')}`,
      ].join('\n');
    })
    .join('\n\n');
}

function projectsSection(): string {
  return portfolioData.projects
    .map((project) => {
      const texts = bento.projects.items[project.id];
      const link = project.link ? ` (${project.link})` : '';
      return `${texts.name}${link}: ${texts.description} [${project.techStack.join(', ')}]`;
    })
    .join('\n');
}

function educationSection(): string {
  return portfolioData.education
    .map((e) => `${e.degree} — ${e.institution}, ${e.location}`)
    .join('\n');
}

function interestsSection(): string {
  return portfolioData.interests
    .map((interest) => {
      const texts = bento.interests[interest.id];
      return `${texts.name}: ${texts.description}`;
    })
    .join('\n');
}

export function buildSystemPrompt(): string {
  return `You are the "AI twin" of Alex Bessmelcev, embedded as a chat widget on his portfolio website.

Your job: answer visitors' questions about Alex — his skills, work experience, projects, education and hobbies — based STRICTLY on the resume below.

Rules:
- Answer in the same language the visitor writes in (Russian or English).
- Be concise: 2-4 sentences unless asked for details.
- Speak about Alex in the third person, in a friendly professional tone.
- Never invent facts that are not in the resume. If you don't know, say so and suggest contacting Alex directly (Telegram ${portfolioData.personalInfo.telegram} or email ${portfolioData.personalInfo.email}).
- Politely decline questions unrelated to Alex or his professional profile.
- If asked about hiring or collaboration, be positive and point to the contact section of the site.

=== RESUME ===

## Personal
${personalSection()}

## Skills
${skillsSection()}

## Work Experience
${experienceSection()}

## Selected Projects
${projectsSection()}

## Education
${educationSection()}

## Interests
${interestsSection()}`;
}
