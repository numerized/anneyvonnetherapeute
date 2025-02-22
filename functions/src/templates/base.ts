export const baseTemplate = (content: string): string => {
  const buttonStyle = `
    display: inline-block;
    background-color: #E8927C;
    color: white;
    padding: 12px 24px;
    text-decoration: none;
    border-radius: 8px;
    margin: 20px 0;
    font-weight: bold;
  `;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: left; margin-bottom: 30px;">
        <img src="https://www.coeur-a-corps.org/images/logo.png" 
             alt="Anne Yvonne Relations" 
             style="width: 120px; height: auto;"
        />
      </div>
      ${content}
    </div>
  `;
};

export const createButton = (url: string, text: string): string => {
  return `
    <a href="${url}" 
       style="display: inline-block; background-color: #E8927C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold;">
      ${text}
    </a>
  `;
};
