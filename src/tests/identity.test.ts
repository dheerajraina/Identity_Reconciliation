import IdentityServices from "../services/identity.services";
import * as path from 'path';
import * as dotenv from "dotenv";
const dotEnvPath =path.resolve("../.env");
dotenv.config({path:dotEnvPath});



describe("identity services", () => {
	const identityService = new IdentityServices();
		it("find contact by email/phone", async () => {
		const result=await identityService.findAllContactsWithSameEmailOrPhone(
			"1234567890",
			"xyz"
		);
		expect(result).toHaveLength(1);
		});

		it("find contact by email/phone", async () => {
			const result=await identityService.findAllContactsWithSameEmailOrPhone(
				"123456789322",
				"xyz@"
			);
			expect(result).toHaveLength(0);
		});
});
