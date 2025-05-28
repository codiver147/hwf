
import { teamBaseService } from './teamBaseService';
import { teamMutationService } from './teamMutationService';
import { teamSkillService } from './teamSkillService';
import { teamMemberService } from './teamMemberService';

// Export a unified teamService that combines all the separate services
export const teamService = {
  ...teamBaseService,
  ...teamMutationService,
  ...teamSkillService,
  ...teamMemberService,
};
