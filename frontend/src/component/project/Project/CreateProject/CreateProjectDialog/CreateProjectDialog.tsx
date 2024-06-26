import { formatUnknownError } from 'utils/formatUnknownError';
import useProjectApi from 'hooks/api/actions/useProjectApi/useProjectApi';
import useToast from 'hooks/useToast';
import FormTemplate from 'component/common/FormTemplate/FormTemplate';
import { NewProjectForm } from '../NewProjectForm';
import { CreateButton } from 'component/common/CreateButton/CreateButton';
import { CREATE_PROJECT } from 'component/providers/AccessProvider/permissions';
import useProjectForm, {
    DEFAULT_PROJECT_STICKINESS,
} from '../../hooks/useProjectForm';
import { usePlausibleTracker } from 'hooks/usePlausibleTracker';
import { type ReactNode, useState } from 'react';
import { useAuthUser } from 'hooks/api/getters/useAuth/useAuthUser';
import useUiConfig from 'hooks/api/getters/useUiConfig/useUiConfig';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, styled } from '@mui/material';
import { ReactComponent as ProjectIcon } from 'assets/icons/projectIconSmall.svg';

interface ICreateProjectDialogueProps {
    open: boolean;
    onClose: () => void;
}

const StyledDialog = styled(Dialog)(({ theme, maxWidth }) => ({
    '& .MuiDialog-paper': {
        borderRadius: theme.shape.borderRadiusLarge,
        maxWidth: theme.spacing(170),
        width: '100%',
        backgroundColor: 'transparent',
    },
    padding: 0,
}));

const CREATE_PROJECT_BTN = 'CREATE_PROJECT_BTN';

const StyledButton = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(3),
}));

const StyledProjectIcon = styled(ProjectIcon)(({ theme }) => ({
    fill: theme.palette.common.white,
    stroke: theme.palette.common.white,
}));

export const CreateProjectDialogue = ({
    open,
    onClose,
}: ICreateProjectDialogueProps) => {
    const { createProject, loading } = useProjectApi();
    const { refetchUser } = useAuthUser();
    const { uiConfig } = useUiConfig();
    const { setToastData, setToastApiError } = useToast();
    const navigate = useNavigate();
    const { trackEvent } = usePlausibleTracker();
    const {
        projectId,
        projectName,
        projectDesc,
        projectMode,
        projectEnvironments,
        projectChangeRequestConfiguration,
        setProjectMode,
        setProjectId,
        setProjectName,
        setProjectDesc,
        setProjectEnvironments,
        updateProjectChangeRequestConfig,
        getCreateProjectPayload,
        clearErrors,
        validateProjectId,
        validateName,
        setProjectStickiness,
        projectStickiness,
        errors,
    } = useProjectForm();

    const generalDocumentation: {
        icon: ReactNode;
        text: string;
        link?: { url: string; label: string };
    } = {
        icon: <StyledProjectIcon />,
        text: 'Projects allows you to group feature flags together in the management UI.',
        link: {
            url: 'https://docs.getunleash.io/reference/projects',
            label: 'Projects documentation',
        },
    };

    const [documentation, setDocumentation] = useState(generalDocumentation);

    const clearDocumentationOverride = () =>
        setDocumentation(generalDocumentation);

    const projectPayload = getCreateProjectPayload({
        omitId: true,
        includeChangeRequestConfig: true,
    });

    const formatApiCode = () => {
        return `curl --location --request POST '${uiConfig.unleashUrl}/api/admin/projects' \\
--header 'Authorization: INSERT_API_KEY' \\
--header 'Content-Type: application/json' \\
--data-raw '${JSON.stringify(projectPayload, undefined, 2)}'`;
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        clearErrors();
        const validName = validateName();

        if (validName) {
            try {
                const createdProject = await createProject(projectPayload);
                refetchUser();
                navigate(`/projects/${createdProject.id}`, { replace: true });
                setToastData({
                    title: 'Project created',
                    text: 'Now you can add flags to this project',
                    confetti: true,
                    type: 'success',
                });

                if (projectStickiness !== DEFAULT_PROJECT_STICKINESS) {
                    trackEvent('project_stickiness_set');
                }
                trackEvent('project-mode', {
                    props: { mode: projectMode, action: 'added' },
                });
            } catch (error: unknown) {
                setToastApiError(formatUnknownError(error));
            }
        }
    };

    return (
        <StyledDialog open={open} onClose={onClose}>
            <FormTemplate
                compact
                disablePadding
                description={documentation.text}
                documentationIcon={documentation.icon}
                documentationLink={documentation.link?.url}
                documentationLinkLabel={documentation.link?.label}
                formatApiCode={formatApiCode}
            >
                <NewProjectForm
                    errors={errors}
                    handleSubmit={handleSubmit}
                    projectId={projectId}
                    projectEnvironments={projectEnvironments}
                    setProjectEnvironments={setProjectEnvironments}
                    setProjectId={setProjectId}
                    projectName={projectName}
                    projectStickiness={projectStickiness}
                    projectChangeRequestConfiguration={
                        projectChangeRequestConfiguration
                    }
                    updateProjectChangeRequestConfig={
                        updateProjectChangeRequestConfig
                    }
                    projectMode={projectMode}
                    setProjectMode={setProjectMode}
                    setProjectStickiness={setProjectStickiness}
                    setProjectName={setProjectName}
                    projectDesc={projectDesc}
                    setProjectDesc={setProjectDesc}
                    mode='Create'
                    clearErrors={clearErrors}
                    validateProjectId={validateProjectId}
                    overrideDocumentation={setDocumentation}
                    clearDocumentationOverride={clearDocumentationOverride}
                >
                    <StyledButton onClick={onClose}>Cancel</StyledButton>
                    <CreateButton
                        name='project'
                        permission={CREATE_PROJECT}
                        disabled={loading}
                        data-testid={CREATE_PROJECT_BTN}
                    />
                </NewProjectForm>
            </FormTemplate>
        </StyledDialog>
    );
};
