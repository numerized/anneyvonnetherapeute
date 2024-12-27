const easeOutQuad = (t: number): number => {
  return t * (2 - t);
};

export const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const yOffset = -80;
  const targetPosition = section.getBoundingClientRect().top + window.scrollY + yOffset;
  
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
};
