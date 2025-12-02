import axios from 'axios';

const buildClient = ({ req }) => {
	if (typeof window === 'undefined') {
		// We are on the server, and requests should be made to the ingress-nginx namespace
		return axios.create({
			baseURL:
				'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
			headers: req.headers,
		});
	} else {
		// We are on the browser, and requests can be made with a base url of ''
		return axios.create({
			baseURL: '/',
		});
	}
};

export default buildClient;
