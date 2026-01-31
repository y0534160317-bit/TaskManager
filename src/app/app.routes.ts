
import { Routes } from '@angular/router';
import { Teams } from './components/teams/teams';
import { AddTeam } from './components/add-team/add-team';
import { AddMember } from './components/add-member/add-member';
import { Projects } from './components/projects/projects';
import { AddProject } from './components/add-project/add-project';
import { Tasks } from './components/tasks/tasks';
import { AddTasks } from './components/add-tasks/add-tasks';
import { UpdateTask } from './components/update-task/update-task';
import { Comments } from './components/comments/comments';
import { AddComment } from './components/add-comment/add-comment';
import { Login } from './components/login/login'; 
import { Register } from './components/register/register'; 
import { authGuard, guestGuard } from './guards/auth-guard' 

export const routes: Routes = [
 
  { 
    path: '', 
    redirectTo: '/teams', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: Login,
    canActivate: [guestGuard]
  },
  { 
    path: 'register', 
    component: Register,
    canActivate: [guestGuard] 
  },
  { 
    path: 'teams', 
    component: Teams,
    canActivate: [authGuard] 
  },
  { 
    path: 'teams/new', 
    component: AddTeam,
    canActivate: [authGuard]
  },
  { 
    path: 'teams/:teamId/add-member', 
    component: AddMember,
    canActivate: [authGuard] 
  },
  { 
    path: 'teams/:teamId/projects', 
    component: Projects,
    canActivate: [authGuard]
  },
  { 
    path: 'teams/:teamId/projects/new', 
    component: AddProject,
    canActivate: [authGuard] 
  },
  { 
    path: 'projects/:projectId/tasks', 
    component: Tasks,
    canActivate: [authGuard]
  },
  { 
    path: 'projects/:projectId/tasks/new', 
    component: AddTasks,
    canActivate: [authGuard]
  },
  { 
    path: 'tasks/:taskId/update', 
    component: UpdateTask,
    canActivate: [authGuard] 
  },
  { 
    path: 'tasks/:taskId/comments', 
    component: Comments,
    canActivate: [authGuard]
  },
  { 
    path: 'tasks/:taskId/comments/new', 
    component: AddComment,
    canActivate: [authGuard]
  },
  { 
    path: '**', 
    redirectTo: '/teams' 
  }
];