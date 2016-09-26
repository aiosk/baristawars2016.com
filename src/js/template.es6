
class Template {
    static flash(status, text) {
        const className = status ? 'parsley-success-list' : 'parsley-errors-list';
        return `<ul class="${className} filled">
    <li>${text}</li>
</ul>`
    }
}
class TemplateForm {
    static notOpen(date = '') {
        return `<p align="center">Open on <br/>${date}</p>`
    }
}
