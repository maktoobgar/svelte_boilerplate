import type { BaseTranslation } from '../i18n-types';

const fa = {
	Components: {
		MultiSelect: {
			NoItems: 'بدون محتوا'
		}
	},

	ServerErrorTitles: {
		Success: 'موفق',
		Info: 'محض اطلاع',
		Warning: 'اخطار',
		Error: 'خطا',

		ServerError: 'خطای سرور',
		BadRequest: 'درخواست دارای خطا'
	},

	ServerErrorMessages: {
		BadRequestBody: 'محتویات درخواست ارسالی دارای اشکال است.'
	},

	Messages: {
		Registered: 'با موفقیت ثبت نام کردید',
		LogInAfterRegister: 'حال وارد سیستم شوید',
		LoggedIn: 'با موفقیت وارد سیستم شدید',
		LoggedOut: 'با موفقیت از سیستم خارج شدید',
		LoginFirst: 'لطفا ابتدا وارد سیستم شوید',
		Updated: 'به روزرسانی موفقیت آمیز بود',
		Deleted: 'حذف موفقیت آمیز بود',
		Created: 'ساخت {item} موفقیت آمیز بود',
		CopiedClipboard: 'محتوا کپی شد'
	}
} satisfies BaseTranslation;

export default fa;
