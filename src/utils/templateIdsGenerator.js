import { uuid } from 'vue-uuid'; 

export const generateTemplateIds = (template) => {
    template.id = uuid.v4();

    template.items = template.items.sort((a, b) => a.sortOrder - b.sortOrder);

    template.items.forEach(item => {
        item.id = uuid.v4();
        item.checkboxes.forEach(checkbox => {
            checkbox.id = uuid.v4();
        });
    });

    return template;
};

export const generateTemplatesIds = (templates) => {
    templates.forEach(template => generateTemplateIds(template));
    return templates;
};

