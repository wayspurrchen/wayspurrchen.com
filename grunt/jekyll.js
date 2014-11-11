module.exports = {
	serve: {
		options: {
			src: 'blog',
			dest: 'public/blog',
			config: 'blog/_config.yml',
			drafts: true,
			watch: true,
			serve: true
		}
	}
};