import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useState } from "react";
import { Controlled } from "react-codemirror2";
import axios from "axios";
import JSONPretty from "react-json-pretty";
import { AppButton } from "../components/AppButton";
import AppContainer from "../components/AppContainer";
import AppSelect from "../components/AppSelect";
import AppAlert from "../components/AppAlert";
import allLanguages from "../data/languages";

const LIMIT = 12; // Max keys permitted by ms translator api via rapide api

const Home: NextPage = () => {
  const [json, setJson] = useState("");
  const [jsonTranslated, setJsonTranslated] = useState("");
  const [inputLng, setInputLng] = useState<null | {
    value: string;
    key: string;
  }>(null);
  const [targetLng, setTargetLng] = useState<null | {
    value: string;
    key: string;
  }>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState("");
  const [apiKey, setApiKey] = useState("");

  // according to ms trnslate free tier can translate ac chunk LIMIT items only
  const translateChunk = useCallback(
    async (chunk: string[]) => {
      if (chunk.length > LIMIT) {
        throw Error(`Can not pass ${LIMIT} item`);
      }

      // Rapid api request config
      const options = {
        params: {
          from: inputLng?.key,
          to: targetLng?.key,
          "api-version": "3.0",
          profanityAction: "NoAction",
          textType: "plain",
        },
        headers: {
          "content-type": "application/json",
          "x-rapidapi-host": "microsoft-translator-text.p.rapidapi.com",
          "x-rapidapi-key": apiKey,
        },
      };

      // Formatting the chunk to an apprropriate object according to ms api [{Text:string}]
      const data = chunk.map((item) => {
        return {
          Text: item,
        };
      });

      const res = await axios.post(
        "https://microsoft-translator-text.p.rapidapi.com/translate",
        data,
        options
      );

      // returning array with translated strings
      return res.data.map(
        (oneTranslate: { translations: [{ text: string; to: string }] }) => {
          return oneTranslate.translations[0].text;
        }
      );
    },
    [apiKey, inputLng?.key, targetLng?.key]
  );

  // create appropriate json format to display
  const fillData = (data: object) => {
    try {
      const stringData = JSON.stringify(data);
      setJsonTranslated(stringData);
    } catch (error: any) {
      console.error(error);
      setErrors(error.message);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  /**
   * Returns void
   *
   * @param {object} targetObject The text value to trnaslate
   * @param {function} callback Take the data:sring[] translated as an arguemnt
   */
  const main = useCallback(
    async (targetObject, callback) => {
      try {
        setLoading(true);
        setJsonTranslated("");
        setErrors("");
        const parsedTarget = JSON.parse(targetObject);
        let result: any = {}; // to collect translated
        const values: string[] = Object.values(parsedTarget);

        let allChunksValues = []; // all translated data pushed to this array

        if (values.length > LIMIT) {
          let currentChunkIndex = 0;
          let allChunksCount = Math.ceil(values.length / LIMIT);

          while (currentChunkIndex <= allChunksCount - 1) {
            let start = currentChunkIndex * LIMIT;
            let end = start + LIMIT;

            const chunk = values.slice(start, end);

            const translatedChunk = await translateChunk(chunk);
            allChunksValues.push(...translatedChunk);

            currentChunkIndex++;
          }

          // filling data,  api returned data as the order they were sent!
          let fillingIndex = 0;
          for (const property in parsedTarget) {
            result[property] = allChunksValues[fillingIndex];
            fillingIndex++;
          }

          callback(result);
          window.scrollTo({
            top: document.querySelector("body")?.scrollHeight,
            behavior: "smooth",
          });
        }
      } catch (error: any) {
        setErrors(error.message);
        console.error(error);
        console.log(error.message);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } finally {
        setLoading(false);
      }
    },
    [translateChunk]
  );

  return (
    <>
      <Head>
        <title>Json translator</title>
      </Head>

      <main className="bg-slate-100">
        <nav className="bg-green-700 py-5 mb-5">
          <AppContainer>
            <h1 className="text-white font-semibold text-xl">
              🌐 Json translator online
            </h1>
          </AppContainer>
        </nav>
        <AppContainer className="bg-green-100 p-5 mb-5">
          <h3 className="font-semibold mb-3 text-slate-600">
            👉 1 - x-rapidapi-key.
          </h3>
          <p>
            Get a <span className="font-bold">x-rapidapi-key</span> (free),
            <a
              target="_blank"
              className="font-bold text-green-800  hover:text-yellow-500"
              href="https://rapidapi.com/"
              rel="noreferrer"
            >
              here 🔗
            </a>
          </p>

          <div className="mt-6">
            <input
              onChange={(e) => setApiKey(e.target.value)}
              type="rapide api key"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Rapide api key"
              required
            />
          </div>
        </AppContainer>
        <AppContainer>
          <AppAlert text={errors} color="yellow" />
        </AppContainer>
        <AppContainer className="bg-white p-5 mb-5">
          <h3 className="font-semibold mb-3 text-slate-600">
            👉 1 - Please input JSON.
          </h3>

          <div className="editor">
            <Controlled
              options={{
                mode: "javascript",
                theme: "seti",
                lineNumbers: true,
              }}
              value={json}
              onBeforeChange={(editor, data, value) => {
                setJson(value);
              }}
              onChange={(editor, data, value) => {
                console.log(editor, data, value);
              }}
            />
          </div>
        </AppContainer>

        <AppContainer className="bg-white p-5 mb-5">
          <div className="my-5">
            <h3 className="font-semibold mb-5 text-slate-600">
              👉 2 - Select source and target languages to translate.
            </h3>
            <div className="flex justify-between">
              <AppSelect
                title="Select source language"
                items={allLanguages}
                callback={(selectedLng) => setInputLng(selectedLng)}
              />
              <AppSelect
                title="Select target language"
                items={allLanguages}
                callback={(selectedLng) => setTargetLng(selectedLng)}
              />
            </div>
          </div>
        </AppContainer>

        <AppContainer className="bg-white p-5 mb-5">
          <h3 className="font-semibold text-slate-600">👉 3 - Translate!</h3>
          <div className="my-5">
            <AppButton
              disabled={!(targetLng && inputLng && apiKey)}
              title={loading ? "🔃 Fetching ..." : "Translate 🌐"}
              onPress={() => main(json, fillData)}
            />
          </div>
        </AppContainer>

        <AppContainer className="bg-white p-5 mb-5">
          <div className="editor">
            {jsonTranslated ? (
              <JSONPretty
                data={jsonTranslated}
                theme={require("react-json-pretty/dist/monikai")}
              />
            ) : (
              <>
                <h3 className="font-semibold text-slate-600">
                  👉 4 - Output will appear here after transalting
                </h3>
              </>
            )}
          </div>
        </AppContainer>

        <AppContainer>
          <AppContainer>
            <div
              className="p-4 mb-4 text-sm text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-300"
              role="alert"
            >
              <h4 className="font-semibold text-lg mb-3">📝 Note</h4>
              <p>
                👉 The information you have entered will not be kept on this
                site.
              </p>
              <p>
                👉 Translation is using Microsoft translator Translate via
                rapide API free tier (500,000 request per month) and handling of
                information before translation is in accordance with Terms of MS
                Translator.
              </p>
              <p>
                👉 Depending on the content of the input, it may not work
                properly.
              </p>
            </div>
          </AppContainer>
        </AppContainer>
      </main>
    </>
  );
};

export default Home;
