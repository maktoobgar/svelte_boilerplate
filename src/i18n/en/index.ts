import type { BaseTranslation } from '../i18n-types';

const en = {
	Components: {
		MultiSelect: {
			NoItems: 'No Content'
		}
	},

	ServerErrorTitles: {
		Success: 'Success',
		Info: 'Info',
		Warning: 'Warning',
		Error: 'Error',

		ServerError: 'Server Error',
		BadRequest: 'Bad Request'
	},

	ServerErrorMessages: {
		BadRequestBody: 'Sent request parameters has some problems.'
	},

	Messages: {
		Registered: 'You registered successfully',
		LogInAfterRegister: 'Now please log into the system',
		LoggedIn: 'You successfully logged in',
		LoggedOut: 'You successfully logged out',
		LoginFirst: 'Please login first',
		Updated: 'Updated successfully',
		Deleted: 'Deleted successfully',
		Created: '{item:string} created successfully',
		CopiedClipboard: 'Copied to clipboard'
	}
} satisfies BaseTranslation;

export default en;
