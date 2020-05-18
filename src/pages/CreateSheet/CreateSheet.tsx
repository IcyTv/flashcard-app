import { createClient } from '@buttercup/googledrive-client';
import { IonButton, IonContent, IonIcon, IonItem, IonList, IonText } from '@ionic/react';
import { addOutline, createOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { Redirect } from 'react-router-dom';
import { VError } from 'verror';
import { Loading } from '../../components/Loading/Loading';
import { database, analytics } from '../../services/firebase';
import { wait, refreshToken } from '../../services/firebase/auth';
import './CreateSheet.scss';
import { refreshAccess } from '../../services/store/google';

const getFilesByType = (files: any, type: string) => {
    const retFiles = (files.files as any[]).filter((v) => v.mime === type);

    let childFiles = [];

    if (files.children) {
        childFiles = (files.children as any[]).map((v) => getFilesByType(v, type));
    }

    return retFiles.concat(childFiles).flat();
};

const openInNewTab = (url: string) => {
    window.open(url, '_blank');
};

export const CreateSheet: React.FC = (props) => {
    const store = useStore();
    // const auth = store.getState().auth as Auth;
    const firebase = useFirebase();

    const [refresh, setRefresh] = useState(null);

    const [files, setFiles] = useState<any[]>();
    const [redirectTo, setRedirectTo] = useState('');

    const [errors, setErrors] = useState('');

    const uid = useSelector((state: ReduxState) => state.firebase.auth.uid);
    const googleAccess = useSelector((state: ReduxState) => state.google);

    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => wait(firebase, setIsAuth), []);

    if (refresh) {
        refreshAccess(store)(refresh);
        setRefresh(null);
        setErrors('');
    }

    if (!isAuth) {
        return <Loading>Waiting for authentication</Loading>;
    }

    if (redirectTo !== '') {
        return <Redirect to={redirectTo} push />;
    }

    const client = createClient(googleAccess.accessToken);

    if (!files) {
        client
            .getDirectoryContents({ tree: true })
            .then((files: any) => {
                const fileList = getFilesByType(files, 'application/vnd.google-apps.spreadsheet');
                console.log('FILES', fileList);

                setFiles(fileList);
            })
            .catch((err: any) => {
                analytics.logEvent('exception', {
                    description: err,
                    fatal: false,
                });
                const { authFailure = false } = VError.info(err);
                // handle authFailure === true
                setErrors(err);
                if (authFailure) {
                    console.error('Auth failiure');

                    refreshToken(firebase, googleAccess.accessToken, setRefresh);
                } else {
                    analytics.logEvent('exception', { description: err });
                    console.error(err);
                }
            });

        return <Loading>Loading Sheets from drive</Loading>;
    }

    const onClick = (index: number) => (ev: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => {
        console.log(files[index]);
        database.ref('/user/' + uid + '/sheets/' + files[index].id).set({
            name: files[index].filename,
        });
        setRedirectTo('/select');
    };

    return (
        <IonContent>
            <IonList className="create-list">
                {errors && <IonText color="danger">{'' + errors}</IonText>}
                {files &&
                    files.map((v, i) => {
                        return (
                            <IonItem key={'file-' + i}>
                                <p>{v.filename}</p>
                                <div>
                                    <IonButton
                                        onClick={() => openInNewTab(`https://docs.google.com/spreadsheets/d/${v.id}`)}
                                        className="edit"
                                    >
                                        <IonIcon icon={createOutline} />
                                    </IonButton>
                                    <IonButton onClick={onClick(i)} className="add">
                                        <IonIcon icon={addOutline} />
                                    </IonButton>
                                </div>
                            </IonItem>
                        );
                    })}
            </IonList>
        </IonContent>
    );
};
