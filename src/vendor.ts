// Angular 2
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';
import '@angular/router';

import 'rxjs';
import '@angularclass/hmr';

// Other vendors for example jQuery, Lodash or Bootstrap
// You can import js, ts, css, sass, ...
import 'clarity-angular';
import { ClarityIcons } from 'clarity-icons';
import { BasicShapes } from 'clarity-icons/shapes/basic-shapes';
import { EssentialShapes } from 'clarity-icons/shapes/essential-shapes';
import { SocialShapes } from 'clarity-icons/shapes/social-shapes';
import { TechnologyShapes } from 'clarity-icons/shapes/technology-shapes';

import '@webcomponents/custom-elements';
import 'mutationobserver-shim';
import 'clarity-ui/clarity-ui.min.css';
import 'clarity-icons/clarity-icons.min.css';

ClarityIcons.add(BasicShapes);
ClarityIcons.add(EssentialShapes);
ClarityIcons.add(SocialShapes);
ClarityIcons.add(TechnologyShapes);
